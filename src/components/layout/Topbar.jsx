import { useLocation, useParams, Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import useStore from '../../store/useStore'

const sectionLabel = {
  chat: 'Chat',
  tasks: 'Tareas',
  board: 'Tablón',
  files: 'Archivos',
  ideas: 'Ideas',
  settings: 'Ajustes',
}

export default function Topbar({ onMenuClick }) {
  const { groupId } = useParams()
  const location = useLocation()
  const { currentGroup } = useStore()

  const parts = location.pathname.split('/').filter(Boolean)
  const section = parts[parts.length - 1]

  const crumbs = []
  if (parts[0] === 'dashboard') {
    crumbs.push({ label: 'Inicio', to: '/dashboard' })
  } else if (groupId) {
    crumbs.push({ label: 'Inicio', to: '/dashboard' })
    if (currentGroup) crumbs.push({ label: currentGroup.name, to: `/group/${groupId}/chat` })
    if (sectionLabel[section]) crumbs.push({ label: sectionLabel[section] })
  }

  return (
    <header className="h-14 flex-shrink-0 flex items-center px-4 border-b border-border dark:border-white/8 bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-sm gap-2">
      <button
        onClick={onMenuClick}
        className="md:hidden w-9 h-9 flex items-center justify-center rounded-md text-ink-3 dark:text-white/40 hover:bg-surface-2 dark:hover:bg-surface-dark-2 active:scale-95 transition-all flex-shrink-0"
        aria-label="Abrir menú"
      >
        <Menu size={18} />
      </button>
      <nav className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5 min-w-0">
            {i > 0 && <span className="text-ink-4 dark:text-white/20 flex-shrink-0">/</span>}
            {c.to ? (
              <Link to={c.to} className="text-ink-3 dark:text-white/40 hover:text-ink dark:hover:text-white transition-colors truncate">
                {c.label}
              </Link>
            ) : (
              <span className="font-medium text-ink dark:text-white truncate">{c.label}</span>
            )}
          </span>
        ))}
      </nav>
    </header>
  )
}
