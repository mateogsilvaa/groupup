import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Upload, Grid, List, Trash2, Download, File, Image } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import useStore from '../../store/useStore'
import { useToast } from '../../hooks/useToast'
import { fileSize, timeAgo } from '../../utils/format'
import Empty from '../../components/ui/Empty'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'

function FileCard({ file, view, onDelete, isAdmin }) {
  const isImage = file.mime_type?.startsWith('image/')

  if (view === 'grid') {
    return (
      <div className="bg-surface dark:bg-surface-dark rounded-lg border border-border dark:border-white/8 overflow-hidden group">
        {isImage ? (
          <div className="aspect-video bg-surface-2 dark:bg-surface-dark-2 overflow-hidden">
            <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-video bg-surface-2 dark:bg-surface-dark-2 flex items-center justify-center">
            <File size={32} className="text-ink-4 dark:text-white/20" />
          </div>
        )}
        <div className="p-3">
          <p className="text-sm font-medium text-ink dark:text-white truncate mb-0.5">{file.name}</p>
          <p className="text-xs text-ink-4 dark:text-white/25">{fileSize(file.size)}</p>
          <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <a href={file.url} download={file.name} target="_blank" rel="noreferrer">
              <button className="p-1.5 rounded hover:bg-surface-2 dark:hover:bg-surface-dark-2 text-ink-3 dark:text-white/40 transition-colors"><Download size={14} /></button>
            </a>
            {isAdmin && (
              <button onClick={() => onDelete(file)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-ink-3 dark:text-white/40 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 p-3 bg-surface dark:bg-surface-dark rounded-lg border border-border dark:border-white/8 group hover:shadow-1 transition-shadow">
      <div className="w-10 h-10 bg-surface-2 dark:bg-surface-dark-2 rounded flex items-center justify-center flex-shrink-0">
        {isImage ? <Image size={20} className="text-ink-3 dark:text-white/30" /> : <File size={20} className="text-ink-3 dark:text-white/30" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink dark:text-white truncate">{file.name}</p>
        <p className="text-xs text-ink-4 dark:text-white/25">{fileSize(file.size)} · {timeAgo(file.created_at)}</p>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <a href={file.url} download={file.name} target="_blank" rel="noreferrer">
          <button className="p-1.5 rounded hover:bg-surface-2 dark:hover:bg-surface-dark-2 text-ink-3 dark:text-white/40 transition-colors"><Download size={14} /></button>
        </a>
        {isAdmin && (
          <button onClick={() => onDelete(file)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-ink-3 dark:text-white/40 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
        )}
      </div>
    </div>
  )
}

export default function Files() {
  const { groupId } = useParams()
  const { user, currentGroup } = useStore()
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [view, setView] = useState('list')
  const fileRef = useRef(null)
  const { success, error } = useToast()

  const isAdmin = currentGroup?.role === 'admin'

  useEffect(() => {
    supabase
      .from('files')
      .select('*')
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setFiles(data || []); setLoading(false) })
  }, [groupId])

  async function uploadFile(file) {
    if (file.size > 50 * 1024 * 1024) { error('Máximo 50 MB'); return }
    setUploading(true)
    const path = `${groupId}/${Date.now()}-${file.name}`
    const { error: upErr } = await supabase.storage.from('group-files').upload(path, file)
    if (upErr) { error('Error al subir archivo'); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('group-files').getPublicUrl(path)
    const { data: dbFile } = await supabase.from('files').insert({
      group_id: groupId,
      uploaded_by: user.id,
      name: file.name,
      url: publicUrl,
      size: file.size,
      mime_type: file.type,
      storage_path: path,
    }).select().single()
    if (dbFile) setFiles(prev => [dbFile, ...prev])
    success('Archivo subido')
    setUploading(false)
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    await uploadFile(file)
    e.target.value = ''
  }

  async function handleDrop(e) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) await uploadFile(file)
  }

  async function handleDelete(file) {
    await supabase.storage.from('group-files').remove([file.storage_path])
    await supabase.from('files').delete().eq('id', file.id)
    setFiles(prev => prev.filter(f => f.id !== file.id))
    success('Archivo eliminado')
  }

  if (loading) return (
    <div className="p-6 flex flex-col gap-3">
      {[0,1,2,3].map(i => <div key={i} className="h-16 sk rounded-lg" />)}
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-border dark:border-white/8 flex-shrink-0">
        <span className="text-sm text-ink-3 dark:text-white/40">{files.length} archivos</span>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setView('list')}
            className={`p-1.5 rounded transition-colors ${view === 'list' ? 'bg-surface-2 dark:bg-surface-dark-2 text-ink dark:text-white' : 'text-ink-4 dark:text-white/25 hover:text-ink dark:hover:text-white'}`}
          >
            <List size={16} />
          </button>
          <button
            onClick={() => setView('grid')}
            className={`p-1.5 rounded transition-colors ${view === 'grid' ? 'bg-surface-2 dark:bg-surface-dark-2 text-ink dark:text-white' : 'text-ink-4 dark:text-white/25 hover:text-ink dark:hover:text-white'}`}
          >
            <Grid size={16} />
          </button>
          <input type="file" ref={fileRef} className="hidden" onChange={handleUpload} />
          <Button size="sm" className="gap-1.5" onClick={() => fileRef.current?.click()} loading={uploading}>
            <Upload size={14} /> Subir archivo
          </Button>
        </div>
      </div>

      <div
        className={`flex-1 overflow-y-auto p-5 relative transition-colors ${isDragOver ? 'bg-primary-faint/40 dark:bg-primary/5' : ''}`}
        onDragEnter={e => { e.preventDefault(); setIsDragOver(true) }}
        onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setIsDragOver(false) }}
        onDrop={handleDrop}
      >
        {isDragOver && (
          <div className="absolute inset-4 border-2 border-dashed border-primary rounded-xl flex items-center justify-center pointer-events-none z-10 bg-surface/90 dark:bg-surface-dark/90 backdrop-blur-sm">
            <div className="text-center">
              <Upload size={32} className="text-primary mx-auto mb-2" />
              <p className="font-semibold text-ink dark:text-white">Suelta para subir</p>
            </div>
          </div>
        )}

        {files.length === 0 ? (
          <Empty icon={File} title="Nada subido aún" description="Arrastra un archivo aquí o usa el botón Subir." />
        ) : view === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map(f => <FileCard key={f.id} file={f} view="grid" onDelete={handleDelete} isAdmin={isAdmin} />)}
          </div>
        ) : (
          <div className="max-w-2xl flex flex-col gap-2">
            {files.map(f => <FileCard key={f.id} file={f} view="list" onDelete={handleDelete} isAdmin={isAdmin} />)}
          </div>
        )}
      </div>
    </div>
  )
}
