import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  DndContext, closestCorners, PointerSensor, useSensor, useSensors,
  DragOverlay, useDroppable, useDraggable,
} from '@dnd-kit/core'
import { Plus, GripVertical, Calendar, User } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import useStore from '../../store/useStore'
import { useToast } from '../../hooks/useToast'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import { Input, Textarea, FormField } from '../../components/ui/Input'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import Empty from '../../components/ui/Empty'
import { timeAgo } from '../../utils/format'

const COLUMNS = [
  { id: 'todo', label: 'Por hacer' },
  { id: 'in_progress', label: 'En progreso' },
  { id: 'done', label: 'Hecho' },
]

const PRIORITY_COLORS = {
  high: 'bg-red-500',
  medium: 'bg-amber-400',
  low: 'bg-emerald-400',
}

const PRIORITY_LABELS = { high: 'Alta', medium: 'Media', low: 'Baja' }

function TaskCard({ task, members }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id })
  const assignee = members.find(m => m.id === task.assigned_to)

  return (
    <div
      ref={setNodeRef}
      style={transform ? { transform: `translate(${transform.x}px,${transform.y}px)` } : undefined}
      className={`bg-surface dark:bg-surface-dark rounded border border-border dark:border-white/8 p-3 flex flex-col gap-2 cursor-default ${isDragging ? 'opacity-40' : 'hover:shadow-1'} transition-shadow`}
    >
      <div className="flex items-start gap-2">
        <button {...attributes} {...listeners} className="mt-0.5 text-ink-4 dark:text-white/20 hover:text-ink-2 cursor-grab active:cursor-grabbing flex-shrink-0">
          <GripVertical size={14} />
        </button>
        <p className="flex-1 text-sm text-ink dark:text-white leading-snug">{task.title}</p>
      </div>
      {task.description && (
        <p className="text-xs text-ink-3 dark:text-white/40 line-clamp-2 ml-5">{task.description}</p>
      )}
      <div className="flex items-center gap-2 ml-5">
        {task.priority && (
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_COLORS[task.priority]}`} title={PRIORITY_LABELS[task.priority]} />
        )}
        {task.due_date && (
          <span className="flex items-center gap-1 text-[10px] text-ink-4 dark:text-white/25">
            <Calendar size={10} /> {new Date(task.due_date).toLocaleDateString('es', { day: '2-digit', month: 'short' })}
          </span>
        )}
        {assignee && (
          <span className="ml-auto">
            <Avatar name={assignee.full_name || assignee.username} url={assignee.avatar_url} size="xs" />
          </span>
        )}
      </div>
    </div>
  )
}

function Column({ column, tasks, members }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  return (
    <div className="flex flex-col min-h-0">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-semibold text-sm text-ink dark:text-white">{column.label}</span>
        <span className="text-xs text-ink-4 dark:text-white/25 bg-surface-2 dark:bg-surface-dark-2 px-1.5 py-0.5 rounded">{tasks.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 flex-1 rounded-lg p-2 min-h-[120px] transition-colors ${isOver ? 'bg-primary-faint' : 'bg-bg dark:bg-bg-dark'}`}
      >
        {tasks.map(t => <TaskCard key={t.id} task={t} members={members} />)}
      </div>
    </div>
  )
}

function CreateTaskModal({ open, onClose, groupId, members, onCreated }) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [priority, setPriority] = useState('medium')
  const [assignee, setAssignee] = useState('')
  const [due, setDue] = useState('')
  const [loading, setLoading] = useState(false)
  const { error } = useToast()

  async function handleCreate(e) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    const { data, error: err } = await supabase.from('tasks').insert({
      group_id: groupId,
      title: title.trim(),
      description: desc.trim() || null,
      priority,
      assigned_to: assignee || null,
      due_date: due || null,
      status: 'todo',
    }).select().single()
    if (err) { error('Error al crear tarea'); setLoading(false); return }
    onCreated(data)
    setTitle(''); setDesc(''); setPriority('medium'); setAssignee(''); setDue('')
    setLoading(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Nueva tarea">
      <form onSubmit={handleCreate} className="p-5 flex flex-col gap-4">
        <FormField label="Título">
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="¿Qué hay que hacer?" required autoFocus />
        </FormField>
        <FormField label="Descripción">
          <Textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Detalles opcionales" rows={3} />
        </FormField>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Prioridad">
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
              className="h-9 px-3 rounded border border-border-2 dark:border-white/10 bg-surface dark:bg-surface-dark text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
          </FormField>
          <FormField label="Vence">
            <Input type="date" value={due} onChange={e => setDue(e.target.value)} />
          </FormField>
        </div>
        <FormField label="Asignar a">
          <select
            value={assignee}
            onChange={e => setAssignee(e.target.value)}
            className="h-9 px-3 rounded border border-border-2 dark:border-white/10 bg-surface dark:bg-surface-dark text-sm text-ink dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="">Sin asignar</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.full_name || m.username}</option>)}
          </select>
        </FormField>
        <div className="flex justify-end gap-2 mt-1">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={loading}>Crear tarea</Button>
        </div>
      </form>
    </Modal>
  )
}

export default function Tasks() {
  const { groupId } = useParams()
  const { currentGroupMembers } = useStore()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [filterAssignee, setFilterAssignee] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const { error } = useToast()

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => {
    supabase
      .from('tasks')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true })
      .then(({ data }) => { setTasks(data || []); setLoading(false) })
  }, [groupId])

  async function handleDragEnd({ active, over }) {
    if (!over || active.id === over.id) return
    const col = COLUMNS.find(c => c.id === over.id)
    if (!col) return
    const task = tasks.find(t => t.id === active.id)
    if (!task || task.status === col.id) return
    setTasks(prev => prev.map(t => t.id === active.id ? { ...t, status: col.id } : t))
    const { error: err } = await supabase.from('tasks').update({ status: col.id }).eq('id', active.id)
    if (err) {
      error('Error al mover tarea')
      setTasks(prev => prev.map(t => t.id === active.id ? { ...t, status: task.status } : t))
    }
  }

  const filtered = tasks.filter(t => {
    if (filterAssignee && t.assigned_to !== filterAssignee) return false
    if (filterPriority && t.priority !== filterPriority) return false
    return true
  })

  if (loading) return (
    <div className="grid grid-cols-3 gap-4 p-6">
      {[0,1,2].map(i => <div key={i} className="flex flex-col gap-3"><div className="h-5 sk rounded w-20" />{[0,1].map(j => <div key={j} className="h-20 sk rounded" />)}</div>)}
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border dark:border-white/8 flex-shrink-0">
        <select
          value={filterAssignee}
          onChange={e => setFilterAssignee(e.target.value)}
          className="h-8 px-2 text-xs rounded border border-border-2 dark:border-white/10 bg-surface dark:bg-surface-dark text-ink dark:text-white"
        >
          <option value="">Todos los miembros</option>
          {currentGroupMembers.map(m => <option key={m.id} value={m.id}>{m.full_name || m.username}</option>)}
        </select>
        <select
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value)}
          className="h-8 px-2 text-xs rounded border border-border-2 dark:border-white/10 bg-surface dark:bg-surface-dark text-ink dark:text-white"
        >
          <option value="">Todas las prioridades</option>
          <option value="high">Alta</option>
          <option value="medium">Media</option>
          <option value="low">Baja</option>
        </select>
        <Button size="sm" className="ml-auto gap-1.5" onClick={() => setCreateOpen(true)}>
          <Plus size={14} /> Nueva tarea
        </Button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-4 p-5 flex-1 overflow-y-auto">
          {COLUMNS.map(col => (
            <Column
              key={col.id}
              column={col}
              tasks={filtered.filter(t => t.status === col.id)}
              members={currentGroupMembers}
            />
          ))}
        </div>
      </DndContext>

      <CreateTaskModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        groupId={groupId}
        members={currentGroupMembers}
        onCreated={(t) => setTasks(prev => [...prev, t])}
      />
    </div>
  )
}
