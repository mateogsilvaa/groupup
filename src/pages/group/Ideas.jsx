import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { Plus, Trash2, ThumbsUp, Edit2, Check, X, Lightbulb } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import useStore from '../../store/useStore'
import { useToast } from '../../hooks/useToast'
import Button from '../../components/ui/Button'
import Empty from '../../components/ui/Empty'

const COLORS = ['#fef9c3','#dcfce7','#dbeafe','#fce7f3','#ede9fe','#ffedd5']
const COLOR_DARK = ['#713f12','#14532d','#1e3a8a','#831843','#4c1d95','#7c2d12']

function StickyNote({ idea, currentUserId, onUpdate, onDelete, onVote, onDragEnd }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(idea.content)
  const [pos, setPos] = useState({ x: idea.pos_x || 80, y: idea.pos_y || 80 })
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })
  const noteRef = useRef(null)

  const voted = (idea.votes || []).includes(currentUserId)
  const colorIdx = COLORS.indexOf(idea.color)
  const textColor = colorIdx >= 0 ? COLOR_DARK[colorIdx] : '#18170f'

  function onMouseDown(e) {
    if (e.target.closest('button') || e.target.closest('textarea')) return
    dragging.current = true
    offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    e.preventDefault()
  }

  function onMouseMove(e) {
    if (!dragging.current) return
    setPos({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y })
  }

  function onMouseUp() {
    if (!dragging.current) return
    dragging.current = false
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    const x = noteRef.current ? parseFloat(noteRef.current.style.left) || pos.x : pos.x
    const y = noteRef.current ? parseFloat(noteRef.current.style.top) || pos.y : pos.y
    onDragEnd(idea.id, pos.x, pos.y)
  }

  function onTouchStart(e) {
    if (e.target.closest('button') || e.target.closest('textarea')) return
    const touch = e.touches[0]
    dragging.current = true
    offset.current = { x: touch.clientX - pos.x, y: touch.clientY - pos.y }
  }

  function onTouchMove(e) {
    if (!dragging.current) return
    const touch = e.touches[0]
    setPos({ x: touch.clientX - offset.current.x, y: touch.clientY - offset.current.y })
  }

  function onTouchEnd() {
    if (!dragging.current) return
    dragging.current = false
    onDragEnd(idea.id, pos.x, pos.y)
  }

  async function saveEdit() {
    if (!text.trim()) return
    await onUpdate(idea.id, text.trim())
    setEditing(false)
  }

  return (
    <div
      ref={noteRef}
      style={{ left: pos.x, top: pos.y, background: idea.color || '#fef9c3', color: textColor, zIndex: 10 }}
      className="absolute w-44 rounded-lg shadow-2 p-3 flex flex-col gap-2 cursor-move select-none"
      onMouseDown={onMouseDown}
    >
      {editing ? (
        <>
          <textarea
            autoFocus
            value={text}
            onChange={e => setText(e.target.value)}
            className="bg-transparent resize-none text-sm outline-none w-full min-h-[60px]"
            style={{ color: textColor }}
          />
          <div className="flex gap-1">
            <button onClick={saveEdit} className="p-1 rounded hover:bg-black/10"><Check size={12} /></button>
            <button onClick={() => { setEditing(false); setText(idea.content) }} className="p-1 rounded hover:bg-black/10"><X size={12} /></button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm leading-snug whitespace-pre-wrap">{idea.content}</p>
          <div className="flex items-center gap-1 mt-auto">
            <button
              onClick={() => onVote(idea)}
              className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded transition-colors ${voted ? 'bg-black/15 font-semibold' : 'hover:bg-black/10'}`}
            >
              <ThumbsUp size={11} /> {(idea.votes || []).length}
            </button>
            <button onClick={() => setEditing(true)} className="ml-auto p-1 rounded hover:bg-black/10">
              <Edit2 size={11} />
            </button>
            <button onClick={() => onDelete(idea.id)} className="p-1 rounded hover:bg-black/10">
              <Trash2 size={11} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default function Ideas() {
  const { groupId } = useParams()
  const { user } = useStore()
  const [ideas, setIdeas] = useState([])
  const [loading, setLoading] = useState(true)
  const canvasRef = useRef(null)
  const { error } = useToast()

  useEffect(() => {
    supabase
      .from('ideas')
      .select('*')
      .eq('group_id', groupId)
      .then(({ data }) => { setIdeas(data || []); setLoading(false) })
  }, [groupId])

  async function addIdea() {
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const x = 80 + Math.random() * 200
    const y = 80 + Math.random() * 200
    const { data } = await supabase.from('ideas').insert({
      group_id: groupId,
      user_id: user.id,
      content: 'Nueva idea',
      color,
      pos_x: x,
      pos_y: y,
    }).select().single()
    if (data) setIdeas(prev => [...prev, data])
  }

  async function handleUpdate(id, content) {
    await supabase.from('ideas').update({ content }).eq('id', id)
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, content } : i))
  }

  async function handleDelete(id) {
    await supabase.from('idea_votes').delete().eq('idea_id', id)
    await supabase.from('ideas').delete().eq('id', id)
    setIdeas(prev => prev.filter(i => i.id !== id))
  }

  async function handleVote(idea) {
    const votes = idea.votes || []
    const next = votes.includes(user.id) ? votes.filter(u => u !== user.id) : [...votes, user.id]
    await supabase.from('ideas').update({ votes: next }).eq('id', idea.id)
    setIdeas(prev => prev.map(i => i.id === idea.id ? { ...i, votes: next } : i))
  }

  async function handleDragEnd(id, x, y) {
    await supabase.from('ideas').update({ pos_x: x, pos_y: y }).eq('id', id)
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, pos_x: x, pos_y: y } : i))
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border dark:border-white/8 flex-shrink-0">
        <span className="text-sm text-ink-3 dark:text-white/40">{ideas.length} ideas · arrastra para mover</span>
        <Button size="sm" className="gap-1.5" onClick={addIdea}>
          <Plus size={14} /> Añadir idea
        </Button>
      </div>

      <div
        ref={canvasRef}
        className="flex-1 relative overflow-hidden bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-surface-2 to-bg dark:from-surface-dark-2 dark:to-bg-dark"
        style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,.04) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      >
        {ideas.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Empty icon={Lightbulb} title="Sin ideas aún" description='Añade la primera con el botón de arriba.' />
          </div>
        ) : (
          ideas.map(idea => (
            <StickyNote
              key={idea.id}
              idea={idea}
              currentUserId={user.id}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onVote={handleVote}
              onDragEnd={handleDragEnd}
            />
          ))
        )}
      </div>
    </div>
  )
}
