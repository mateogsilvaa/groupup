import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Send, Smile, Paperclip, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import useStore from '../../store/useStore'
import { chatTime } from '../../utils/format'
import Avatar from '../../components/ui/Avatar'
import { useToast } from '../../hooks/useToast'

const REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🔥']

function MessageItem({ msg, currentUserId, onReact, onDelete }) {
  const [showEmoji, setShowEmoji] = useState(false)
  const isMe = msg.user_id === currentUserId
  const reactions = msg.reactions || {}

  function renderText(text) {
    return text.replace(/@(\w+)/g, '<span class="text-primary font-medium">@$1</span>')
  }

  return (
    <div className={`group flex gap-3 px-4 py-1.5 hover:bg-surface-2/50 dark:hover:bg-white/[.02] ${isMe ? 'flex-row-reverse' : ''}`}>
      <Avatar name={msg.profiles?.full_name || msg.profiles?.username} url={msg.profiles?.avatar_url} size="sm" className="flex-shrink-0 mt-0.5" />
      <div className={`flex-1 max-w-[70%] ${isMe ? 'flex flex-col items-end' : ''}`}>
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className="text-xs font-semibold text-ink dark:text-white">
            {isMe ? 'Tú' : (msg.profiles?.full_name || msg.profiles?.username || 'Usuario')}
          </span>
          <span className="text-[10px] text-ink-4 dark:text-white/25">{chatTime(msg.created_at)}</span>
        </div>
        {msg.image_url && (
          <img src={msg.image_url} alt="adjunto" className="max-w-xs rounded-lg mb-1 border border-border dark:border-white/8" />
        )}
        <p
          className={`text-sm leading-relaxed rounded-lg px-3 py-2 ${isMe ? 'bg-primary text-white' : 'bg-surface dark:bg-surface-dark-2 text-ink dark:text-white'}`}
          dangerouslySetInnerHTML={{ __html: renderText(msg.content) }}
        />
        {Object.keys(reactions).length > 0 && (
          <div className="flex gap-1 mt-1 flex-wrap">
            {Object.entries(reactions).map(([emoji, users]) => (
              <button
                key={emoji}
                onClick={() => onReact(msg.id, emoji)}
                className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full border transition-colors ${users.includes(currentUserId) ? 'border-primary/30 bg-primary-faint' : 'border-border dark:border-white/10 bg-surface dark:bg-surface-dark-2'}`}
              >
                {emoji} <span className="text-ink-3 dark:text-white/40">{users.length}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={`opacity-0 group-hover:opacity-100 transition-opacity flex items-center ${isMe ? 'mr-1' : 'ml-1'}`}>
        <div className="relative">
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="p-1 rounded hover:bg-surface-2 dark:hover:bg-surface-dark-2 text-ink-4 dark:text-white/25"
          >
            <Smile size={14} />
          </button>
          {showEmoji && (
            <div className="absolute bottom-7 left-0 bg-surface dark:bg-surface-dark-2 border border-border dark:border-white/10 rounded-lg p-2 flex gap-1 shadow-3 z-10">
              {REACTIONS.map(e => (
                <button key={e} onClick={() => { onReact(msg.id, e); setShowEmoji(false) }} className="text-base hover:scale-125 transition-transform">
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Chat() {
  const { groupId } = useParams()
  const { user } = useStore()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const fileRef = useRef(null)
  const { error } = useToast()

  const scrollDown = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    setLoading(true)
    supabase
      .from('messages')
      .select('*, profiles(id, full_name, username, avatar_url)')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true })
      .limit(100)
      .then(({ data }) => { setMessages(data || []); setLoading(false) })

    const sub = supabase
      .channel(`chat:${groupId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'messages',
        filter: `group_id=eq.${groupId}`,
      }, async (payload) => {
        const { data } = await supabase
          .from('messages')
          .select('*, profiles(id, full_name, username, avatar_url)')
          .eq('id', payload.new.id)
          .single()
        if (data) setMessages(prev => [...prev, data])
      })
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'messages',
        filter: `group_id=eq.${groupId}`,
      }, (payload) => {
        setMessages(prev => prev.map(m => m.id === payload.new.id ? { ...m, ...payload.new } : m))
      })
      .subscribe()

    return () => supabase.removeChannel(sub)
  }, [groupId])

  useEffect(() => { scrollDown() }, [messages])

  async function sendMessage(e) {
    e?.preventDefault()
    const content = text.trim()
    if (!content) return
    setText('')
    const { error: err } = await supabase.from('messages').insert({ group_id: groupId, user_id: user.id, content })
    if (err) error('Error al enviar')
  }

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 50 * 1024 * 1024) { error('Máximo 50 MB'); return }
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${groupId}/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from('group-files').upload(path, file)
    if (upErr) { error('Error al subir imagen'); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('group-files').getPublicUrl(path)
    const isImage = file.type.startsWith('image/')
    await supabase.from('messages').insert({
      group_id: groupId,
      user_id: user.id,
      content: file.name,
      image_url: isImage ? publicUrl : null,
    })
    setUploading(false)
  }

  async function handleReact(msgId, emoji) {
    const msg = messages.find(m => m.id === msgId)
    if (!msg) return
    const reactions = { ...(msg.reactions || {}) }
    const users = reactions[emoji] || []
    if (users.includes(user.id)) {
      reactions[emoji] = users.filter(u => u !== user.id)
      if (!reactions[emoji].length) delete reactions[emoji]
    } else {
      reactions[emoji] = [...users, user.id]
    }
    await supabase.from('messages').update({ reactions }).eq('id', msgId)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  if (loading) return (
    <div className="flex flex-col gap-3 p-4">
      {[0,1,2,3].map(i => (
        <div key={i} className="flex gap-3">
          <div className="w-8 h-8 sk rounded-full" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-3 sk w-24 rounded" />
            <div className="h-9 sk rounded-lg w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-surface-2 dark:bg-surface-dark-2 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-ink-4 dark:text-white/20">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p className="font-medium text-ink dark:text-white">Sé el primero en decir algo</p>
              <p className="text-sm text-ink-3 dark:text-white/40 mt-1">Rompe el hielo.</p>
            </div>
          </div>
        ) : (
          messages.map(m => (
            <MessageItem key={m.id} msg={m} currentUserId={user.id} onReact={handleReact} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border dark:border-white/8 p-3">
        <form onSubmit={sendMessage} className="flex items-end gap-2">
          <input type="file" ref={fileRef} className="hidden" onChange={handleFile} accept="image/*" />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="p-2 rounded text-ink-3 dark:text-white/40 hover:bg-surface-2 dark:hover:bg-surface-dark-2 transition-colors flex-shrink-0 disabled:opacity-40"
          >
            <Paperclip size={18} />
          </button>
          <textarea
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje… (@menciona a alguien)"
            rows={1}
            className="flex-1 bg-surface-2 dark:bg-surface-dark-2 border border-border dark:border-white/8 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 text-ink dark:text-white placeholder:text-ink-4 dark:placeholder:text-white/30 max-h-28"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="p-2 rounded bg-primary text-white hover:bg-primary-hover transition-colors disabled:opacity-40 flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
