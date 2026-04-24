import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Pin, Heart, Plus, Trash2, Layout } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import useStore from '../../store/useStore'
import { useToast } from '../../hooks/useToast'
import { timeAgo } from '../../utils/format'
import Avatar from '../../components/ui/Avatar'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import { Input, Textarea, FormField } from '../../components/ui/Input'
import Empty from '../../components/ui/Empty'

function PostCard({ post, isAdmin, currentUserId, onDelete, onPin, onLike }) {
  const liked = (post.likes || []).includes(currentUserId)
  return (
    <div className={`bg-surface dark:bg-surface-dark rounded-lg border p-5 flex flex-col gap-3 ${post.pinned ? 'border-primary/30 bg-primary-faint/30 dark:bg-primary/5' : 'border-border dark:border-white/8'}`}>
      {post.pinned && (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <Pin size={12} /> Anclado
        </span>
      )}
      <div className="flex items-start gap-3">
        <Avatar name={post.profiles?.full_name || post.profiles?.username} url={post.profiles?.avatar_url} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-ink dark:text-white">{post.profiles?.full_name || post.profiles?.username}</p>
          <p className="text-xs text-ink-4 dark:text-white/25">{timeAgo(post.created_at)}</p>
        </div>
        {isAdmin && (
          <div className="flex gap-1">
            <button onClick={() => onPin(post)} className={`p-1.5 rounded hover:bg-surface-2 dark:hover:bg-surface-dark-2 transition-colors ${post.pinned ? 'text-primary' : 'text-ink-4 dark:text-white/25'}`}>
              <Pin size={14} />
            </button>
            <button onClick={() => onDelete(post.id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-ink-4 dark:text-white/25 hover:text-red-500 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-ink dark:text-white mb-1">{post.title}</h3>
        <p className="text-sm text-ink-2 dark:text-white/70 whitespace-pre-wrap">{post.content}</p>
      </div>
      <div className="flex items-center gap-1 mt-1">
        <button
          onClick={() => onLike(post)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${liked ? 'bg-primary-faint text-primary dark:text-primary-dark' : 'text-ink-3 dark:text-white/40 hover:bg-surface-2 dark:hover:bg-surface-dark-2'}`}
        >
          <Heart size={13} className={liked ? 'fill-current' : ''} />
          {(post.likes || []).length}
        </button>
      </div>
    </div>
  )
}

function CreatePostModal({ open, onClose, groupId, onCreated }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useStore()
  const { error } = useToast()

  async function handleCreate(e) {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    setLoading(true)
    const { data, error: err } = await supabase.from('board_posts')
      .insert({ group_id: groupId, user_id: user.id, title: title.trim(), content: content.trim() })
      .select('*, profiles(id, full_name, username, avatar_url)')
      .single()
    if (err) { error('Error al publicar'); setLoading(false); return }
    onCreated(data)
    setTitle(''); setContent('')
    setLoading(false)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Nueva publicación">
      <form onSubmit={handleCreate} className="p-5 flex flex-col gap-4">
        <FormField label="Título">
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título de la publicación" required autoFocus />
        </FormField>
        <FormField label="Contenido">
          <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Escribe aquí…" rows={5} required />
        </FormField>
        <div className="flex justify-end gap-2 mt-1">
          <Button variant="ghost" type="button" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={loading}>Publicar</Button>
        </div>
      </form>
    </Modal>
  )
}

export default function Board() {
  const { groupId } = useParams()
  const { user, currentGroup } = useStore()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const { error } = useToast()

  const isAdmin = currentGroup?.role === 'admin'

  useEffect(() => {
    supabase
      .from('board_posts')
      .select('*, profiles(id, full_name, username, avatar_url)')
      .eq('group_id', groupId)
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .then(({ data }) => { setPosts(data || []); setLoading(false) })
  }, [groupId])

  async function handleDelete(id) {
    await supabase.from('board_posts').delete().eq('id', id)
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  async function handlePin(post) {
    const next = !post.pinned
    await supabase.from('board_posts').update({ pinned: next }).eq('id', post.id)
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, pinned: next } : p)
      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0)))
  }

  async function handleLike(post) {
    const likes = post.likes || []
    const next = likes.includes(user.id) ? likes.filter(u => u !== user.id) : [...likes, user.id]
    await supabase.from('board_posts').update({ likes: next }).eq('id', post.id)
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, likes: next } : p))
  }

  if (loading) return (
    <div className="flex flex-col gap-4 p-6">
      {[0,1,2].map(i => <div key={i} className="h-40 sk rounded-lg" />)}
    </div>
  )

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border dark:border-white/8 flex-shrink-0">
        <span className="text-sm text-ink-3 dark:text-white/40">{posts.length} publicaciones</span>
        <Button size="sm" className="gap-1.5" onClick={() => setCreateOpen(true)}>
          <Plus size={14} /> Publicar
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {posts.length === 0 ? (
          <Empty icon={Layout} title="Sin publicaciones aún" description="Sé el primero en publicar algo para el grupo." />
        ) : (
          <div className="max-w-2xl mx-auto flex flex-col gap-4">
            {posts.map(p => (
              <PostCard
                key={p.id}
                post={p}
                isAdmin={isAdmin}
                currentUserId={user.id}
                onDelete={handleDelete}
                onPin={handlePin}
                onLike={handleLike}
              />
            ))}
          </div>
        )}
      </div>

      <CreatePostModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        groupId={groupId}
        onCreated={(p) => setPosts(prev => [p, ...prev])}
      />
    </div>
  )
}
