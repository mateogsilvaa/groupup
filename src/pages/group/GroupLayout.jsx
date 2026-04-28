import { useEffect } from 'react'
import { Outlet, useParams, useNavigate } from 'react-router-dom'
import { Copy, Users } from 'lucide-react'
import useStore from '../../store/useStore'
import Avatar from '../../components/ui/Avatar'
import { useToast } from '../../hooks/useToast'

const GROUP_COLORS = [
  'bg-teal-600', 'bg-indigo-500', 'bg-violet-500', 'bg-rose-500',
  'bg-amber-500', 'bg-emerald-600', 'bg-sky-500', 'bg-pink-500',
]
function groupColor(id) {
  if (!id) return GROUP_COLORS[0]
  const n = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return GROUP_COLORS[n % GROUP_COLORS.length]
}

export default function GroupLayout() {
  const { groupId } = useParams()
  const { groups, setCurrentGroup, fetchGroupMembers, currentGroup, currentGroupMembers } = useStore()
  const navigate = useNavigate()
  const { success } = useToast()

  useEffect(() => {
    const g = groups.find(g => g.id === groupId)
    if (g) {
      setCurrentGroup(g)
      fetchGroupMembers(groupId)
    } else if (groups.length > 0) {
      navigate('/dashboard')
    }
  }, [groupId, groups])

  function copyCode() {
    if (!currentGroup?.invite_code) return
    navigator.clipboard.writeText(currentGroup.invite_code)
    success('Código copiado')
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {currentGroup && (
        <div className="flex-shrink-0 h-10 flex items-center gap-3 px-4 border-b border-border dark:border-white/8 bg-surface dark:bg-surface-dark">
          <div className={`w-5 h-5 rounded-sm text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 ${groupColor(groupId)}`}>
            {currentGroup.name?.[0]?.toUpperCase()}
          </div>
          <span className="font-medium text-sm text-ink dark:text-white truncate flex-1 min-w-0">{currentGroup.name}</span>
          <div className="flex items-center gap-2 flex-shrink-0">
            {currentGroupMembers.length > 0 && (
              <div className="hidden sm:flex items-center gap-1.5">
                <div className="flex -space-x-1">
                  {currentGroupMembers.slice(0, 5).map(m => (
                    <Avatar key={m.id} name={m.full_name || m.username} url={m.avatar_url} size="xs" className="ring-1 ring-surface dark:ring-surface-dark" />
                  ))}
                </div>
                {currentGroupMembers.length > 5 && (
                  <span className="text-xs text-ink-4 dark:text-white/25">+{currentGroupMembers.length - 5}</span>
                )}
                <span className="text-xs text-ink-4 dark:text-white/25 flex items-center gap-0.5 ml-0.5">
                  <Users size={10} /> {currentGroupMembers.length}
                </span>
              </div>
            )}
            <button
              onClick={copyCode}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-semibold text-ink-3 dark:text-white/40 hover:bg-surface-2 dark:hover:bg-surface-dark-2 hover:text-primary dark:hover:text-primary-dark transition-colors border border-transparent hover:border-border dark:hover:border-white/8"
              title="Copiar código de invitación"
            >
              <Copy size={10} />
              <span className="hidden sm:block">{currentGroup.invite_code}</span>
            </button>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}
