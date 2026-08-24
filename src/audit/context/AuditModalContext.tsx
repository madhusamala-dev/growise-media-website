import { createContext, useContext, useState, ReactNode } from 'react'
import { InstagramAuditModal } from '../components/InstagramAuditModal'

interface AuditModalContextType {
  isOpen: boolean
  initialUsername: string
  openAuditModal: (username?: string) => void
  closeAuditModal: () => void
}

const AuditModalContext = createContext<AuditModalContextType | undefined>(undefined)

export function AuditModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [initialUsername, setInitialUsername] = useState('')

  const openAuditModal = (username?: string) => {
    setInitialUsername(username || '')
    setIsOpen(true)
  }

  const closeAuditModal = () => {
    setIsOpen(false)
  }

  return (
    <AuditModalContext.Provider
      value={{ isOpen, initialUsername, openAuditModal, closeAuditModal }}
    >
      {children}
      <InstagramAuditModal
        isOpen={isOpen}
        onClose={closeAuditModal}
        initialUsername={initialUsername}
      />
    </AuditModalContext.Provider>
  )
}

export function useAuditModal() {
  const context = useContext(AuditModalContext)
  if (!context) {
    throw new Error('useAuditModal must be used within an AuditModalProvider')
  }
  return context
}
