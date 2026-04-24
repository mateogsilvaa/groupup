import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, CheckSquare, ArrowRight, Gift } from 'lucide-react'
import useStore from '../store/useStore'
import { supabase } from '../lib/supabase'
import { SkeletonCard } from '../components/ui/Skeleton'
import Empty from '../components/ui/Empty'
import Avatar from '../components/ui/Avatar'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import { useToast } from '../hooks/useToast'

function GroupCard({ group }) {
  const navigate = useNavigate()
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      onClick={() => navigate(`/group/${group.id}/chat`)}
      className="bg-surface dark:bg-surface-dark rounded-lg p-5 border border-border dark:border-white/8 cursor-pointer hover:shadow-2 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary text-white font-bold text-base flex items-center justify-center">
          {group.name?.[0]?.toUpperCase()}
        </div>
        {group.role === 'admin' && <Badge variant="admin">Admin</Badge>}
      </div>
      <h3 className="font-semibold text-ink dark:text-white mb-1 truncate">{group.name}</h3>
      {group.description && (
        <p className="text-sm text-ink-3 dark:text-white/40 mb-3 line-clamp-2">{group.description}</p>
      )}
      <div className="flex items-center gap-3 text-xs text-ink-4 dark:text-white/25">
        <span className="flex items-center gap-1"><Users size={12} /> {group.member_count || 0}</span>
        <ArrowRight size={12} className="ml-auto" />
      </div>
    </motion.div>
  )
}

function TaskSummary({ tasks }) {
  if (!tasks.length) return (
    <Empty icon={CheckSquare} title="Sin tareas asignadas" description="Las tareas asignadas a ti aparecerán aquí." className="py-8" />
  )
  return (
    <ul className="flex flex-col divide-y divide-border dark:divide-white/8">
      {tasks.slice(0, 5).map(t => (
        <li key={t.id} className="py-3 flex items-center gap-3">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${t.priority === 'high' ? 'bg-red-500' : t.priority === 'medium' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          <span className="flex-1 text-sm text-ink dark:text-white truncate">{t.title}</span>
          <Link to={`/group/${t.group_id}/tasks`} className="text-xs text-ink-4 dark:text-white/25 hover:text-primary transition-colors flex-shrink-0">
            {t.groups?.name}
          </Link>
        </li>
      ))}
    </ul>
  )
}

function ReferralWidget({ user }) {
  const { success } = useToast()
  const code = user?.id?.slice(-8).toUpperCase() ?? '...'

  function copyCode() {
    navigator.clipboard.writeText(code).then(() => success('Código copiado'))
  }

  return (
    <div className="bg-surface dark:bg-surface-dark rounded-lg border border-border dark:border-white/8 p-5 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary-faint flex items-center justify-center text-primary flex-shrink-0">
          <Gift size={18} />
        </div>
        <div>
          <h3 className="font-semibold text-ink dark:text-white">Invita a 3 amigos → 1 mes gratis para todos</h3>
          <p className="text-sm text-ink-3 dark:text-white/40 mt-0.5">
            Cuando se registren con tu código, todos ganáis 1 mes del plan Estudiante.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-surface-2 dark:bg-surface-dark-2 rounded px-3 py-2 border border-border dark:border-white/8">
          <span className="font-mono text-sm font-semibold text-ink dark:text-white tracking-wider">{code}</span>
        </div>
        <Button size="sm" variant="outline" onClick={copyCode}>Copiar</Button>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-surface-3 dark:bg-surface-dark-3 rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full w-0" />
        </div>
        <span className="text-xs text-ink-4 dark:text-white/25 flex-shrink-0">0 / 3 amigos</span>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { groups, user, fetchGroups } = useStore()
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
        .limit(10)
        .then(({ data }) => { setTasks(data || []); setLoadingTasks(false) })
    }
  }, [user])

  return (
    <div className="h-full overflow-y-auto bg-bg dark:bg-bg-dark">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="font-display text-3xl font-bold text-ink dark:text-white mb-8">Inicio</h1>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-ink dark:text-white">Tus grupos</h2>
          </div>
          {loadingGroups ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0,1,2].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : groups.length === 0 ? (
            <Empty
              icon={Users}
              title="Aún no tienes grupos"
              description="Crea uno o únete con un código usando el sidebar."
              className="py-12 bg-surface dark:bg-surface-dark rounded-lg border border-border dark:border-white/8"
            />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map(g => <GroupCard key={g.id} group={g} />)}
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="font-semibold text-ink dark:text-white mb-4">Tareas asignadas a mí</h2>
          <div className="bg-surface dark:bg-surface-dark rounded-lg border border-border dark:border-white/8 p-4">
            {loadingTasks ? (
              <div className="flex flex-col gap-3">
                {[0,1,2].map(i => <div key={i} className="h-8 sk rounded" />)}
              </div>
            ) : (
              <TaskSummary tasks={tasks} />
            )}
          </div>
        </section>

        <section>
          <ReferralWidget user={user} />
        </section>
      </div>
    </div>
  )
}
