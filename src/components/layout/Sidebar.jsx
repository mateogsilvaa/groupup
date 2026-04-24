import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { clsx } from 'clsx'
import { MessageSquare, CheckSquare, Layout, Paperclip, Lightbulb, Settings, Users, Plus, Sun, Moon, LogOut, Home } from 'lucide-react'
import useStore from '../../store/useStore'
import Avatar from '../ui/Avatar'

const groupNav = [
  { to: 'chat', icon: MessageSquare, label: 'Chat' },
  { to: 'tasks', icon: CheckSquare, label: 'Tareas' },
  { to: 'board', icon: Layout, label: 'Tablón' },
  { to: 'files', icon: Paperclip, label: 'Archivos' },
  { to: 'ideas', icon: Lightbulb, label: 'Ideas' },
  { to: 'settings', icon: Settings, label: 'Ajustes' },
]

export default function Sidebar({ onCreateGroup, onJoinGroup }) {
  const { groupId } = useParams()
  const { groups, currentGroup, profile, theme, toggleTheme, signOut } = useStore()
  const navigate = useNavigate()

  return (
    <aside className="w-[220px] h-full flex flex-col bg-surface dark:bg-surface-dark border-r border-border dark:border-white/8 flex-shrink-0">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-border dark:border-white/8">
        <span className="font-display text-xl font-bold text-primary">GroupUp</span>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-3 flex flex-col gap-0.5 px-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) => clsx(
            'flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors',
            isActive
              ? 'bg-primary-faint text-primary dark:text-primary-dark font-medium'
              : 'text-ink-2 dark:text-white/60 hover:bg-surface-2 dark:hover:bg-surface-dark-2 hover:text-ink dark:hover:text-white',
          )}
        >
          <Home size={16} />
          Inicio
        </NavLink>

        {/* Groups list */}
        <div className="mt-3 mb-1 px-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-4 dark:text-white/25">Grupos</p>
        </div>
        {groups.map(g => (
          <button
            key={g.id}
            onClick={() => navigate(`/group/${g.id}/chat`)}
            className={clsx(
              'flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors w-full text-left',
              g.id === groupId
                ? 'bg-primary-faint text-primary dark:text-primary-dark font-medium'
                : 'text-ink-2 dark:text-white/60 hover:bg-surface-2 dark:hover:bg-surface-dark-2 hover:text-ink dark:hover:text-white',
            )}
          >
            <span className="w-6 h-6 rounded bg-primary text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
              {g.name?.[0]?.toUpperCase()}
            </span>
            <span className="truncate">{g.name}</span>
          </button>
        ))}

        <button
          onClick={onCreateGroup}
          className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-ink-3 dark:text-white/40 hover:bg-surface-2 dark:hover:bg-surface-dark-2 hover:text-ink dark:hover:text-white transition-colors w-full text-left"
        >
          <Plus size={16} />
          Nuevo grupo
        </button>
        <button
          onClick={onJoinGroup}
          className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-ink-3 dark:text-white/40 hover:bg-surface-2 dark:hover:bg-surface-dark-2 hover:text-ink dark:hover:text-white transition-colors w-full text-left"
        >
          <Users size={16} />
          Unirse con código
        </button>

        {/* Group sub-nav */}
        {groupId && (
          <>
            <div className="mt-3 mb-1 px-3">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-4 dark:text-white/25 truncate">
                {currentGroup?.name || 'Grupo'}
              </p>
            </div>
            {groupNav.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={`/group/${groupId}/${to}`}
                className={({ isActive }) => clsx(
                  'flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors',
                  isActive
                    ? 'bg-primary-faint text-primary dark:text-primary-dark font-medium'
                    : 'text-ink-2 dark:text-white/60 hover:bg-surface-2 dark:hover:bg-surface-dark-2 hover:text-ink dark:hover:text-white',
                )}
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border dark:border-white/8 flex flex-col gap-1">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2.5 px-3 py-2 rounded text-sm text-ink-3 dark:text-white/40 hover:bg-surface-2 dark:hover:bg-surface-dark-2 hover:text-ink dark:hover:text-white transition-colors w-full"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          {theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
        </button>
        <div className="flex items-center gap-2.5 px-3 py-2">
          <Avatar name={profile?.full_name || profile?.username} url={profile?.avatar_url} size="sm" />
          <span className="flex-1 text-sm text-ink dark:text-white truncate">{profile?.full_name || profile?.username || 'Usuario'}</span>
          <button onClick={signOut} className="text-ink-4 dark:text-white/25 hover:text-red-500 transition-colors">
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
