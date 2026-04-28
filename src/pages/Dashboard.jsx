import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, CheckSquare, ArrowRight, Calendar } from 'lucide-react'
import useStore from '../store/useStore'
import { supabase } from '../lib/supabase'
import { SkeletonCard } from '../components/ui/Skeleton'

const GROUP_COLORS = [
  'bg-teal-600', 'bg-indigo-500', 'bg-violet-500', 'bg-rose-500',
  'bg-amber-500', 'bg-emerald-600', 'bg-sky-500', 'bg-pink-500',
]
function groupColor(id) {
  if (!id) return GROUP_COLORS[0]
  const n = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return GROUP_COLORS[n % GROUP_COLORS.length]
}

function GroupCard({ group }) {
  const navigate = useNavigate()
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={() => navigate(`/group/${group.id}/chat`)}
      className="bg-surface dark:bg-surface-dark rounded-xl p-5 border border-border dark:border-white/8 cursor-pointer hover:border-primary/20 dark:hover:border-primary/20 hover:shadow-2 transition-all"
    >
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl text-white font-bold text-base flex items-center justify-center flex-shrink-0 ${groupColor(group.id)}`}>
          {group.name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-ink dark:text-white truncate">{group.name}</h3>
          {group.description && (
            <p className="text-xs text-ink-3 dark:text-white/40 mt-0.5 truncate">{group.description}</p>
          )}
        </div>
        {group.role === 'admin' && (
          <span className="text-[10px] font-bold uppercase tracking-wide text-primary dark:text-primary-dark bg-primary-faint px-1.5 py-0.5 rounded flex-shrink-0">Admin</span>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs text-ink-4 dark:text-white/25">
        <Users size={12} />
        <span>{group.member_count || 0} miembro{group.member_count !== 1 ? 's' : ''}</span>
        <span className="ml-auto flex items-center gap-1 text-primary/70 dark:text-primary-dark/70 font-medium">
          Abrir <ArrowRight size={11} />
        </span>
      </div>
    </motion.div>
  )
}

export default function Dashboard() {
  const { groups, user, profile, fetchGroups } = useStore()
  const [tasks, setTasks] = useState([])
  const [loadingGroups, setLoadingGroups] = useState(true)
  const [loadingTasks, setLoadingTasks] = useState(true)

  useEffect(() => {
    fetchGroups().finally(() => setLoadingGroups(false))
    if (user) {
      supabase
        .from('tasks')
        .select('*, groups(name)')
        .eq('assigned_to', user.id)
        .neq('status', 'done')
        .order('created_at', { ascending: false })
        .limit(8)
        .then(({ data }) => { setTasks(data || []); setLoadingTasks(false) })
    }
  }, [user])

  const firstName = profile?.full_name?.split(' ')[0] || profile?.username || 'Usuario'
  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="h-full overflow-y-auto bg-bg dark:bg-bg-dark">
      <div className="bg-surface dark:bg-surface-dark border-b border-border dark:border-white/8 px-6 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl font-bold text-ink dark:text-white">Hola, {firstName}</h1>
            <p className="text-sm text-ink-3 dark:text-white/40 mt-0.5 capitalize">{today}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-ink dark:text-white">{groups.length}</p>
              <p className="text-xs text-ink-4 dark:text-white/25">grupos</p>
            </div>
            {tasks.length > 0 && (
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-primary">{tasks.length}</p>
                <p className="text-xs text-ink-4 dark:text-white/25">pendientes</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-10">
        <section>
          <h2 className="font-semibold text-ink dark:text-white mb-5">Tus grupos</h2>
          {loadingGroups ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0,1,2].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : groups.length === 0 ? (
            <div className="bg-surface dark:bg-surface-dark rounded-xl border border-dashed border-border-2 dark:border-white/10 p-10 text-center">
              <div className="w-14 h-14 rounded-2xl bg-primary-faint flex items-center justify-center mx-auto mb-4">
                <Users size={28} className="text-primary" />
              </div>
              <h3 className="font-semibold text-ink dark:text-white mb-2">Crea tu primer grupo</h3>
              <p className="text-sm text-ink-3 dark:text-white/40 max-w-xs mx-auto mb-4">
                Organiza tu equipo con chat, tareas, tablón e ideas en un solo lugar.
              </p>
              <p className="text-xs text-ink-4 dark:text-white/25">
                Pulsa <strong className="text-ink-3 dark:text-white/40">+ Nuevo grupo</strong> en la barra lateral
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map(g => <GroupCard key={g.id} group={g} />)}
            </div>
          )}
        </section>

        <section>
          <h2 className="font-semibold text-ink dark:text-white mb-5">Tareas asignadas a mí</h2>
          <div className="bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-white/8 overflow-hidden">
            {loadingTasks ? (
              <div className="flex flex-col gap-3 p-5">
                {[0,1,2].map(i => <div key={i} className="h-10 sk rounded" />)}
              </div>
            ) : tasks.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mx-auto mb-3">
                  <CheckSquare size={20} className="text-emerald-500" />
                </div>
                <p className="font-medium text-sm text-ink dark:text-white">Sin tareas pendientes</p>
                <p className="text-xs text-ink-4 dark:text-white/25 mt-1">Todo al día. O aún no te han asignado ninguna.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border dark:divide-white/8">
                {tasks.map(t => (
                  <li key={t.id}>
                    <Link
                      to={`/group/${t.group_id}/tasks`}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-2 dark:hover:bg-white/[.02] transition-colors"
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.priority === 'high' ? 'bg-red-500' : t.priority === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                      <span className="flex-1 text-sm text-ink dark:text-white truncate">{t.title}</span>
                      {t.due_date && (
                        <span className="flex items-center gap-1 text-xs text-ink-4 dark:text-white/25 flex-shrink-0">
                          <Calendar size={11} />
                          {new Date(t.due_date).toLocaleDateString('es', { day: '2-digit', month: 'short' })}
                        </span>
                      )}
                      <span className="text-xs text-ink-4 dark:text-white/25 flex-shrink-0 hidden sm:block">{t.groups?.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
