import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Copy, RefreshCw, Trash2, UserMinus, Crown } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import useStore from '../../store/useStore'
import { useToast } from '../../hooks/useToast'
import Button from '../../components/ui/Button'
import { Input, Textarea, FormField } from '../../components/ui/Input'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'

const NAV = [
  { id: 'info', label: 'Información' },
  { id: 'invite', label: 'Invitación' },
  { id: 'members', label: 'Miembros' },
  { id: 'danger', label: 'Peligro' },
]

export default function GroupSettings() {
  const { groupId } = useParams()
  const { user, currentGroup, currentGroupMembers, fetchGroupMembers, fetchGroups, setCurrentGroup } = useStore()
  const navigate = useNavigate()
  const { success, error } = useToast()

  const [section, setSection] = useState('info')
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [saving, setSaving] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  const isAdmin = currentGroup?.role === 'admin'

  useEffect(() => {
    if (currentGroup) { setName(currentGroup.name || ''); setDesc(currentGroup.description || '') }
  }, [currentGroup])

  async function saveInfo(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    const { data, error: err } = await supabase
      .from('groups')
      .update({ name: name.trim(), description: desc.trim() })
      .eq('id', groupId)
      .select().single()
    if (err) { error('Error al guardar'); setSaving(false); return }
    setCurrentGroup({ ...currentGroup, ...data })
    await fetchGroups()
    success('Cambios guardados')
    setSaving(false)
  }

  async function regenCode() {
    setRegenerating(true)
    const code = Math.random().toString(36).slice(2, 8).toUpperCase()
    await supabase.from('groups').update({ invite_code: code }).eq('id', groupId)
    setCurrentGroup({ ...currentGroup, invite_code: code })
    success('Código regenerado')
    setRegenerating(false)
  }

  function copyCode() {
    navigator.clipboard.writeText(currentGroup?.invite_code || '')
    success('Código copiado')
  }

  async function kickMember(memberId) {
    await supabase.from('group_members').delete().eq('group_id', groupId).eq('user_id', memberId)
    await fetchGroupMembers(groupId)
    success('Miembro eliminado')
  }

  async function toggleAdmin(member) {
    const next = member.role === 'admin' ? 'member' : 'admin'
    await supabase.from('group_members').update({ role: next }).eq('group_id', groupId).eq('user_id', member.id)
    await fetchGroupMembers(groupId)
    success(`Rol actualizado`)
  }

  async function deleteGroup() {
    if (!window.confirm('¿Eliminar el grupo? Esta acción no se puede deshacer.')) return
    await supabase.from('group_members').delete().eq('group_id', groupId)
    await supabase.from('messages').delete().eq('group_id', groupId)
    await supabase.from('tasks').delete().eq('group_id', groupId)
    await supabase.from('board_posts').delete().eq('group_id', groupId)
    await supabase.from('files').delete().eq('group_id', groupId)
    const { data: ideaIds } = await supabase.from('ideas').select('id').eq('group_id', groupId)
    const ids = (ideaIds || []).map(i => i.id)
    if (ids.length) await supabase.from('idea_votes').delete().in('idea_id', ids)
    await supabase.from('ideas').delete().eq('group_id', groupId)
    await supabase.from('groups').delete().eq('id', groupId)
    await fetchGroups()
    navigate('/dashboard')
    success('Grupo eliminado')
  }

  async function leaveGroup() {
    if (!window.confirm('¿Salir del grupo?')) return
    await supabase.from('group_members').delete().eq('group_id', groupId).eq('user_id', user.id)
    await fetchGroups()
    navigate('/dashboard')
    success('Has salido del grupo')
  }

  return (
    <div className="flex h-full">
      {/* Nav */}
      <div className="w-48 flex-shrink-0 border-r border-border dark:border-white/8 p-3 flex flex-col gap-0.5">
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => setSection(n.id)}
            className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${section === n.id ? 'bg-primary-faint text-primary dark:text-primary-dark font-medium' : 'text-ink-2 dark:text-white/60 hover:bg-surface-2 dark:hover:bg-surface-dark-2 hover:text-ink dark:hover:text-white'}`}
          >
            {n.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {section === 'info' && (
          <div className="max-w-md">
            <h2 className="font-semibold text-ink dark:text-white mb-6">Información del grupo</h2>
            <form onSubmit={saveInfo} className="flex flex-col gap-4">
              <FormField label="Nombre del grupo">
                <Input value={name} onChange={e => setName(e.target.value)} disabled={!isAdmin} required />
              </FormField>
              <FormField label="Descripción">
                <Textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} disabled={!isAdmin} />
              </FormField>
              {isAdmin && (
                <Button type="submit" loading={saving} className="self-start">Guardar cambios</Button>
              )}
            </form>
          </div>
        )}

        {section === 'invite' && (
          <div className="max-w-md">
            <h2 className="font-semibold text-ink dark:text-white mb-6">Código de invitación</h2>
            <div className="flex items-center gap-3 p-4 bg-surface-2 dark:bg-surface-dark-2 rounded-lg border border-border dark:border-white/8 mb-4">
              <span className="font-mono text-2xl font-bold text-ink dark:text-white tracking-widest flex-1">
                {currentGroup?.invite_code}
              </span>
              <button onClick={copyCode} className="p-2 rounded hover:bg-surface-3 dark:hover:bg-surface-dark-3 text-ink-3 dark:text-white/40 transition-colors">
                <Copy size={16} />
              </button>
            </div>
            {isAdmin && (
              <Button variant="outline" className="gap-2" onClick={regenCode} loading={regenerating}>
                <RefreshCw size={14} /> Regenerar código
              </Button>
            )}
            <p className="text-xs text-ink-4 dark:text-white/25 mt-3">Comparte este código para que otros se unan al grupo.</p>
          </div>
        )}

        {section === 'members' && (
          <div className="max-w-md">
            <h2 className="font-semibold text-ink dark:text-white mb-6">{currentGroupMembers.length} miembros</h2>
            <ul className="flex flex-col divide-y divide-border dark:divide-white/8">
              {currentGroupMembers.map(m => (
                <li key={m.id} className="flex items-center gap-3 py-3">
                  <Avatar name={m.full_name || m.username} url={m.avatar_url} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink dark:text-white truncate">{m.full_name || m.username}</p>
                    <p className="text-xs text-ink-4 dark:text-white/25">{m.email}</p>
                  </div>
                  <Badge variant={m.role === 'admin' ? 'admin' : 'default'}>{m.role === 'admin' ? 'Admin' : 'Miembro'}</Badge>
                  {isAdmin && m.id !== user.id && (
                    <div className="flex gap-1">
                      <button onClick={() => toggleAdmin(m)} className="p-1.5 rounded hover:bg-surface-2 dark:hover:bg-surface-dark-2 text-ink-4 dark:text-white/25 transition-colors" title={m.role === 'admin' ? 'Quitar admin' : 'Hacer admin'}>
                        <Crown size={14} />
                      </button>
                      <button onClick={() => kickMember(m.id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-ink-4 dark:text-white/25 hover:text-red-500 transition-colors">
                        <UserMinus size={14} />
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {section === 'danger' && (
          <div className="max-w-md">
            <h2 className="font-semibold text-ink dark:text-white mb-6">Zona de peligro</h2>
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-lg border border-border dark:border-white/8">
                <p className="text-sm font-medium text-ink dark:text-white mb-1">Salir del grupo</p>
                <p className="text-xs text-ink-3 dark:text-white/40 mb-3">Ya no tendrás acceso a este grupo.</p>
                <Button variant="outline" size="sm" onClick={leaveGroup}>Salir del grupo</Button>
              </div>
              {isAdmin && (
                <div className="p-4 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-900/10">
                  <p className="text-sm font-medium text-red-700 dark:text-red-400 mb-1">Eliminar grupo</p>
                  <p className="text-xs text-red-500/70 dark:text-red-400/50 mb-3">Acción permanente. Se borrarán todos los mensajes, tareas y archivos.</p>
                  <Button variant="danger" size="sm" onClick={deleteGroup}>Eliminar grupo</Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
