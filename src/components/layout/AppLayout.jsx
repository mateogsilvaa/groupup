import { useState, useEffect } from 'react'
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

function CreateGroupModal({ open, onClose }) {
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, fetchGroups } = useStore()
  const { success, error } = useToast()
  const navigate = useNavigate()

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
    await supabase.from('group_members').insert({ group_id: group.id, user_id: user.id, role: 'admin' })
    await fetchGroups()
    success(`Grupo "${group.name}" creado`)
    setLoading(false)
    onClose()
    navigate(`/group/${group.id}/chat`)
  }

  return (
    <Modal open={open} onClose={onClose} title="Crear grupo">
      <form onSubmit={handleCreate} className="p-5 flex flex-col gap-4">
        <FormField label="Nombre del grupo">
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Mi equipo" required />
        </FormField>
        <FormField label="Descripción (opcional)">
          <Input value={desc} onChange={e => setDesc(e.target.value)} placeholder="¿De qué trata este grupo?" />
        </FormField>
        <div className="flex justify-end gap-2 mt-1">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={loading}>Crear grupo</Button>
        </div>
      </form>
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
  const { fetchGroups } = useStore()

  useEffect(() => {
    fetchGroups()
  }, [])

  return (
    <div className="flex h-screen bg-bg dark:bg-bg-dark overflow-hidden">
      <Sidebar onCreateGroup={() => setCreateOpen(true)} onJoinGroup={() => setJoinOpen(true)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
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
