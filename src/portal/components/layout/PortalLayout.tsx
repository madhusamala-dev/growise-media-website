import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { X } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { cn } from '../../../lib/cn'

export function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    if (!sidebarOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSidebarOpen(false)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  return (
    <div className="relative min-h-screen bg-ink-950 text-paper-50">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-0 right-0 top-0 z-0 h-72 opacity-60"
        style={{ background: 'radial-gradient(60% 100% at 50% 0%, rgba(255,74,17,0.09), transparent 70%)' }}
      />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[17rem] border-r border-white/10 bg-ink-900/60 backdrop-blur-xl lg:block">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-50 lg:hidden',
          sidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        aria-hidden={!sidebarOpen}
        inert={sidebarOpen ? undefined : true}
      >
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className={cn(
            'absolute inset-0 bg-ink-950/70 backdrop-blur-sm transition-opacity duration-300',
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          )}
        />
        <div
          className={cn(
            'absolute inset-y-0 left-0 w-[17rem] border-r border-white/10 bg-ink-900 shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
            className="absolute right-3 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-ink-300 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Main column */}
      <div className="relative z-10 lg:pl-[17rem]">
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-[86rem] px-4 py-6 sm:px-6 sm:py-8">
          <div key={pathname} className="animate-fade-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
