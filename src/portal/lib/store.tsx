import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  BrandKit,
  ContentItem,
  ContentStatus,
  Conversation,
  PlatformId,
  PlatformState,
  PlatformStatus,
  PortalNotification,
  PortalSettings,
} from '../data/types'
import {
  daysFromNow,
  demoBrandKit,
  demoContent,
  demoConversations,
  demoNotifications,
  demoPlatforms,
  demoSettings,
  msFromNow,
} from '../data/demo'

const STATE_KEY = 'growise.portal'

/* ------------------------------------------------------------------ */
/*  Persisted mutable slice. Everything else (dates, copy) stays in    */
/*  demo.ts as the source of truth — swap it for API calls later.      */
/* ------------------------------------------------------------------ */

interface PersistedState {
  revisions: Record<string, { status: ContentStatus; feedbackNote?: string; scheduledAt?: string }>
  readNotificationIds: string[]
  readConvIds: string[]
  platformOverrides: Partial<Record<PlatformId, PlatformStatus>>
  brand: BrandKit
  settings: PortalSettings
  extraMessages: Record<string, PortalMessageRuntime[]>
}

interface PortalMessageRuntime {
  id: string
  from: 'team' | 'client'
  body: string
  time: string
  createdAt: number
}

const defaultPersisted: PersistedState = {
  revisions: {},
  readNotificationIds: [],
  readConvIds: [],
  platformOverrides: {},
  brand: demoBrandKit,
  settings: demoSettings,
  extraMessages: {},
}

function loadPersisted(): PersistedState {
  try {
    const raw = localStorage.getItem(STATE_KEY)
    if (!raw) return defaultPersisted
    const parsed = JSON.parse(raw) as Partial<PersistedState>
    return {
      ...defaultPersisted,
      ...parsed,
      revisions: { ...defaultPersisted.revisions, ...(parsed.revisions ?? {}) },
      readNotificationIds: parsed.readNotificationIds ?? [],
      readConvIds: parsed.readConvIds ?? [],
      platformOverrides: { ...defaultPersisted.platformOverrides, ...(parsed.platformOverrides ?? {}) },
      extraMessages: { ...defaultPersisted.extraMessages, ...(parsed.extraMessages ?? {}) },
    }
  } catch {
    return defaultPersisted
  }
}

interface PortalContextValue {
  content: ContentItem[]
  platforms: PlatformState[]
  notifications: PortalNotification[]
  conversations: Conversation[]
  brand: BrandKit
  settings: PortalSettings
  unreadNotifications: number
  unreadConversations: number
  /* actions */
  approveContent: (id: string) => void
  requestChanges: (id: string, note: string) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  connectPlatform: (id: PlatformId) => Promise<void>
  disconnectPlatform: (id: PlatformId) => void
  markConversationRead: (id: string) => void
  sendMessage: (convId: string, body: string) => void
  updateBrand: (patch: Partial<BrandKit>) => void
  updateSettings: (patch: Partial<PortalSettings>) => void
}

const PortalContext = createContext<PortalContextValue | null>(null)

export function PortalProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<PersistedState>(() => loadPersisted())
  const [runtimeNotifications, setRuntimeNotifications] = useState<PortalNotification[]>([])

  useEffect(() => {
    localStorage.setItem(STATE_KEY, JSON.stringify(persisted))
  }, [persisted])

  /* ----------------------- derived data ----------------------- */

  const content = useMemo<ContentItem[]>(() => {
    return demoContent.map((item) => {
      const rev = persisted.revisions[item.id]
      if (!rev) return item
      return {
        ...item,
        status: rev.status,
        feedbackNote: rev.feedbackNote ?? item.feedbackNote,
        scheduledAt: rev.scheduledAt ?? item.scheduledAt,
      }
    })
  }, [persisted.revisions])

  const platforms = useMemo<PlatformState[]>(
    () =>
      demoPlatforms.map((p) => ({
        ...p,
        status: persisted.platformOverrides[p.id] ?? p.status,
      })),
    [persisted.platformOverrides]
  )

  const notifications = useMemo<PortalNotification[]>(
    () => [
      ...runtimeNotifications,
      ...demoNotifications.map((n) => ({
        ...n,
        read: n.read || persisted.readNotificationIds.includes(n.id),
      })),
    ],
    [runtimeNotifications, persisted.readNotificationIds]
  )

  const conversations = useMemo<Conversation[]>(() => {
    return demoConversations.map((conv) => {
      const extras = persisted.extraMessages[conv.id] ?? []
      const messages = [...conv.messages, ...extras]
      const baseUnread = persisted.readConvIds.includes(conv.id) ? 0 : conv.unread
      return { ...conv, messages, unread: baseUnread }
    })
  }, [persisted.extraMessages, persisted.readConvIds])

  const unreadNotifications = notifications.filter((n) => !n.read).length
  const unreadConversations = conversations.reduce((acc, c) => acc + c.unread, 0)

  /* -------------------------- actions ------------------------- */

  const approveContent = useCallback((id: string) => {
    setPersisted((p) => ({
      ...p,
      revisions: {
        ...p.revisions,
        [id]: { status: 'scheduled', scheduledAt: daysFromNow(2) },
      },
    }))
    const item = demoContent.find((c) => c.id === id)
    setRuntimeNotifications((n) => [
      {
        id: `rt-${Date.now()}`,
        kind: 'scheduled',
        title: 'Content approved 🎉',
        body: item
          ? `“${item.title}” was approved and is being scheduled.`
          : 'Your content was approved and is being scheduled.',
        time: 'just now',
        createdAt: msFromNow(0),
        read: false,
        href: '/calendar',
      },
      ...n,
    ])
  }, [])

  const requestChanges = useCallback((id: string, note: string) => {
    setPersisted((p) => ({
      ...p,
      revisions: {
        ...p.revisions,
        [id]: { status: 'revision', feedbackNote: note.trim() },
      },
    }))
  }, [])

  const markNotificationRead = useCallback((id: string) => {
    setRuntimeNotifications((n) => n.map((x) => (x.id === id ? { ...x, read: true } : x)))
    setPersisted((p) =>
      p.readNotificationIds.includes(id) ? p : { ...p, readNotificationIds: [...p.readNotificationIds, id] }
    )
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setRuntimeNotifications((n) => n.map((x) => ({ ...x, read: true })))
    setPersisted((p) => ({
      ...p,
      readNotificationIds: [...demoNotifications.map((n) => n.id), ...p.readNotificationIds],
    }))
  }, [])

  const connectPlatform = useCallback(
    async (id: PlatformId) => {
      // Simulated OAuth round-trip.
      await new Promise((r) => setTimeout(r, 1400))
      setPersisted((p) => ({
        ...p,
        platformOverrides: { ...p.platformOverrides, [id]: 'connected' },
      }))
      const platform = demoPlatforms.find((pl) => pl.id === id)
      setRuntimeNotifications((n) => [
        {
          id: `rt-${Date.now()}`,
          kind: 'info',
          title: `${platform?.displayName ?? 'Platform'} connected`,
          body: 'GroWise can now create and publish content there.',
          time: 'just now',
          createdAt: msFromNow(0),
          read: false,
          href: '/social-accounts',
        },
        ...n,
      ])
    },
    []
  )

  const disconnectPlatform = useCallback((id: PlatformId) => {
    setPersisted((p) => ({
      ...p,
      platformOverrides: { ...p.platformOverrides, [id]: 'not_connected' },
    }))
  }, [])

  const markConversationRead = useCallback((id: string) => {
    setPersisted((p) =>
      p.readConvIds.includes(id) ? p : { ...p, readConvIds: [...p.readConvIds, id] }
    )
  }, [])

  const sendMessage = useCallback((convId: string, body: string) => {
    const clean = body.trim()
    if (!clean) return
    const msg: PortalMessageRuntime = {
      id: `cm-${Date.now()}`,
      from: 'client',
      body: clean,
      time: 'just now',
      createdAt: Date.now(),
    }
    setPersisted((p) => ({
      ...p,
      extraMessages: { ...p.extraMessages, [convId]: [...(p.extraMessages[convId] ?? []), msg] },
    }))
    // Canned team reply — makes the demo feel alive.
    const replyId = `cm-${Date.now() + 1}`
    window.setTimeout(() => {
      setPersisted((p) => ({
        ...p,
        extraMessages: {
          ...p.extraMessages,
          [convId]: [
            ...(p.extraMessages[convId] ?? []),
            {
              id: replyId,
              from: 'team',
              body: 'Thanks — we’ve got it. The team will get back to you within a few hours. ⚡',
              time: 'just now',
              createdAt: Date.now(),
            },
          ],
        },
      }))
    }, 1600)
  }, [])

  const updateBrand = useCallback((patch: Partial<BrandKit>) => {
    setPersisted((p) => ({ ...p, brand: { ...p.brand, ...patch } }))
  }, [])

  const updateSettings = useCallback((patch: Partial<PortalSettings>) => {
    setPersisted((p) => ({ ...p, settings: { ...p.settings, ...patch } }))
  }, [])

  const value = useMemo<PortalContextValue>(
    () => ({
      content,
      platforms,
      notifications,
      conversations,
      brand: persisted.brand,
      settings: persisted.settings,
      unreadNotifications,
      unreadConversations,
      approveContent,
      requestChanges,
      markNotificationRead,
      markAllNotificationsRead,
      connectPlatform,
      disconnectPlatform,
      markConversationRead,
      sendMessage,
      updateBrand,
      updateSettings,
    }),
    [
      content,
      platforms,
      notifications,
      conversations,
      persisted.brand,
      persisted.settings,
      unreadNotifications,
      unreadConversations,
      approveContent,
      requestChanges,
      markNotificationRead,
      markAllNotificationsRead,
      connectPlatform,
      disconnectPlatform,
      markConversationRead,
      sendMessage,
      updateBrand,
      updateSettings,
    ]
  )

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>
}

export function usePortal(): PortalContextValue {
  const ctx = useContext(PortalContext)
  if (!ctx) throw new Error('usePortal must be used within PortalProvider')
  return ctx
}
