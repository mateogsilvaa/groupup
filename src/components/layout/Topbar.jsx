import { useLocation, useParams, Link } from 'react-router-dom'
import useStore from '../../store/useStore'

const sectionLabel = {
  chat: 'Chat',
  tasks: 'Tareas',
  board: 'Tablón',
  files: 'Archivos',
  ideas: 'Ideas',
  settings: 'Ajustes',
}

export default function Topbar() {
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
    <header className="h-14 flex-shrink-0 flex items-center px-6 border-b border-border dark:border-white/8 bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-sm">
      <nav className="flex items-center gap-1.5 text-sm">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-ink-4 dark:text-white/20">/</span>}
            {c.to ? (
              <Link to={c.to} className="text-ink-3 dark:text-white/40 hover:text-ink dark:hover:text-white transition-colors">
                {c.label}
              </Link>
            ) : (
              <span className="font-medium text-ink dark:text-white">{c.label}</span>
            )}
          </span>
        ))}
      </nav>
    </header>
  )
}
