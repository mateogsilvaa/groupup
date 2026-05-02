import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'
import { Input, FormField } from './Input'
import useStore from '../../store/useStore'
import { supabase } from '../../lib/supabase'
import { useToast } from '../../hooks/useToast'
import Avatar from './Avatar'

export default function ProfileEditModal({ open, onClose }) {
  const { profile, user, fetchProfile } = useStore()
  const { success, error } = useToast()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [username, setUsername] = useState(profile?.username || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setFullName(profile?.full_name || '')
    setUsername(profile?.username || '')
    setAvatarUrl(profile?.avatar_url || '')
  }, [open, profile])

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('group-files')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('group-files')
        .getPublicUrl(filePath)

      setAvatarUrl(data.publicUrl)
    } catch (err) {
      error('Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!fullName.trim()) {
      error('El nombre no puede estar vacío')
      return
    }

    try {
      setLoading(true)
      const { error: err } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          username: username.trim() || fullName.trim(),
          avatar_url: avatarUrl || null,
        })
        .eq('id', user.id)

      if (err) throw err

      await fetchProfile(user.id)
      success('Perfil actualizado')
      onClose()
    } catch (err) {
      error('Error al guardar perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Editar perfil" size="xl" className="max-h-[calc(100vh-3rem)] overflow-y-auto">
      <form onSubmit={handleSave} className="p-6 flex flex-col gap-6">
        {/* Avatar */}
        <div className="rounded-[28px] border border-border dark:border-white/10 bg-surface-2 dark:bg-surface-dark-2 p-6 flex flex-col items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <Avatar
              name={fullName || username}
              url={avatarUrl}
              size="xl"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover disabled:opacity-50 transition-colors"
            >
              {uploading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload size={14} />
              )}
            </button>
          </motion.div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden"
            disabled={uploading}
          />
          <p className="text-xs text-ink-3 dark:text-white/40">Máx. 5MB</p>
        </div>

        {/* Avatar URL */}
        <FormField label="URL de foto (opcional)">
          <Input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://ejemplo.com/foto.jpg"
            disabled={loading || uploading}
          />
        </FormField>

        {/* Full Name */}
        <FormField label="Nombre completo">
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Tu nombre"
            disabled={loading}
          />
        </FormField>

        {/* Username */}
        <FormField label="Usuario (opcional)">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Tu usuario único"
            disabled={loading}
          />
        </FormField>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || uploading}
            className="flex-1"
          >
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
