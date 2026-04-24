import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Modal from '../ui/Modal'
import { Input, FormField } from '../ui/Input'
import Button from '../ui/Button'
import useStore from '../../store/useStore'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../hooks/useToast'

const TEMPLATES = [
  {
    id: 'tfg', icon: '📚', label: 'Trabajo de grupo / TFG',
    desc: 'Coordinación de tareas, reparto de secciones y entrega final.',
    tasks: ['Definir estructura del trabajo', 'Reunión de kick-off del equipo', 'Reparto de secciones'],
  },
  {
    id: 'study', icon: '🎓', label: 'Grupo de estudio',
    desc: 'Preparación de exámenes, resúmenes y dudas compartidas.',
    tasks: ['Crear resumen del Tema 1', 'Recopilar dudas para clase', 'Preparar test de práctica'],
  },
  {
    id: 'lab', icon: '🔬', label: 'Proyecto de laboratorio',
    desc: 'Gestión de experimentos, datos y redacción del informe.',
    tasks: ['Revisar protocolo del experimento', 'Registrar resultados', 'Redactar informe final'],
  },
  {
    id: 'event', icon: '🎉', label: 'Organización de evento',
    desc: 'Logística, comunicación y tareas para coordinar un evento.',
    tasks: ['Definir fecha y lugar', 'Lista de tareas pendientes', 'Confirmar asistentes'],
  },
  {
    id: 'blank', icon: '✦', label: 'En blanco',
    desc: 'Empieza desde cero con la configuración que necesites.',
    tasks: [],
  },
]

function CreateGroupModal({ open, onClose }) {
  const [step, setStep] = useState(1)
  const [template, setTemplate] = useState(null)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, fetchGroups } = useStore()
  const { success, error } = useToast()
  const navigate = useNavigate()

  function handleSelectTemplate(t) {
    setTemplate(t)
    setDesc(t.id !== 'blank' ? t.desc : '')
    setStep(2)
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    const code = Math.random().toString(36).slice(2, 8).toUpperCase()
    const { data: group, error: err } = await supabase
      .from('groups')
      .insert({ name: name.trim(), description: desc.trim(), invite_code: code, created_by: user.id })
      .select()
      .single()
    if (err) { error('Error al crear el grupo'); setLoading(false); return }

    const { error: memberErr } = await supabase
      .from('group_members')
      .insert({ group_id: group.id, user_id: user.id, role: 'admin' })
    if (memberErr) {
      await supabase.from('group_members')
        .update({ role: 'admin' })
        .eq('group_id', group.id)
        .eq('user_id', user.id)
    }

    if (template?.tasks?.length) {
      await supabase.from('tasks').insert(
        template.tasks.map(title => ({
          group_id: group.id,
          title,
          status: 'todo',
          priority: 'medium',
          assigned_to: user.id,
        }))
      )
    }

    await fetchGroups()
    success(`Grupo "${group.name}" creado`)
    setLoading(false)
    handleClose()
    navigate(`/group/${group.id}/chat`)
  }

  function handleClose() {
    setStep(1)
    setTemplate(null)
    setName('')
    setDesc('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title={step === 1 ? 'Elige una plantilla' : 'Crea tu grupo'}>
      {step === 1 ? (
        <div className="p-5 flex flex-col gap-2">
          {TEMPLATES.map(t => (
            <button
              key={t.id}
              onClick={() => handleSelectTemplate(t)}
              className="flex items-center gap-4 p-4 rounded-lg border border-border dark:border-white/8 hover:border-primary/50 hover:bg-primary-faint dark:hover:bg-primary/5 transition-all text-left w-full group"
            >
              <span className="text-2xl flex-shrink-0 select-none">{t.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-ink dark:text-white">{t.label}</p>
                <p className="text-xs text-ink-3 dark:text-white/40 mt-0.5">{t.desc}</p>
              </div>
              <span className="text-ink-4 dark:text-white/20 text-sm opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">→</span>
            </button>
          ))}
        </div>
      ) : (
        <form onSubmit={handleCreate} className="p-5 flex flex-col gap-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex items-center gap-1.5 text-xs text-ink-3 dark:text-white/40 hover:text-primary dark:hover:text-primary-dark transition-colors self-start"
          >
            ← Cambiar plantilla
          </button>
          {template && template.id !== 'blank' && (
            <div className="flex items-center gap-2.5 px-3 py-2 bg-surface-2 dark:bg-surface-dark-2 rounded-lg text-sm border border-border dark:border-white/8">
              <span className="text-base">{template.icon}</span>
              <span className="text-ink-2 dark:text-white/60 font-medium">{template.label}</span>
              {template.tasks.length > 0 && (
                <span className="ml-auto text-xs text-ink-4 dark:text-white/25">{template.tasks.length} tareas iniciales</span>
              )}
            </div>
          )}
          <FormField label="Nombre del grupo">
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Mi equipo" required autoFocus />
          </FormField>
          <FormField label="Descripción">
            <Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="¿De qué trata este grupo?" />
          </FormField>
          <div className="flex justify-end gap-2 mt-1">
            <Button variant="ghost" type="button" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" loading={loading}>Crear grupo</Button>
          </div>
        </form>
      )}
    </Modal>
  )
}

function JoinGroupModal({ open, onClose }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, fetchGroups } = useStore()
  const { success, error } = useToast()
  const navigate = useNavigate()

  async function handleJoin(e) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    const { data: group } = await supabase
      .from('groups')
      .select('id, name')
      .eq('invite_code', code.trim().toUpperCase())
      .single()
    if (!group) { error('Código inválido'); setLoading(false); return }
    const { data: existing } = await supabase
      .from('group_members')
      .select('id')
      .eq('group_id', group.id)
      .eq('user_id', user.id)
      .single()
    if (existing) { error('Ya eres miembro de este grupo'); setLoading(false); return }
    await supabase.from('group_members').insert({ group_id: group.id, user_id: user.id, role: 'member' })
    await fetchGroups()
    success(`Te uniste a "${group.name}"`)
    setLoading(false)
    setCode('')
    onClose()
    navigate(`/group/${group.id}/chat`)
  }

  return (
    <Modal open={open} onClose={onClose} title="Unirse con código">
      <form onSubmit={handleJoin} className="p-5 flex flex-col gap-4">
        <FormField label="Código de invitación">
          <Input
            value={code}
            onChange={e => setCode(e.target.value.toUpperCase())}
            placeholder="ABC123"
            maxLength={8}
            required
          />
        </FormField>
        <div className="flex justify-end gap-2 mt-1">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={loading}>Unirse</Button>
        </div>
      </form>
    </Modal>
  )
}

export default function AppLayout() {
  const [createOpen, setCreateOpen] = useState(false)
  const [joinOpen, setJoinOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-bg dark:bg-bg-dark overflow-hidden">
      <Sidebar
        onCreateGroup={() => setCreateOpen(true)}
        onJoinGroup={() => setJoinOpen(true)}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-hidden">
          <motion.div
            className="h-full"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
      <CreateGroupModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <JoinGroupModal open={joinOpen} onClose={() => setJoinOpen(false)} />
    </div>
  )
}
