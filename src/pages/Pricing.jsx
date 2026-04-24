import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, MessageSquare, CheckSquare, Layout, Lightbulb, Paperclip, Users, Zap, Sparkles } from 'lucide-react'
import Button from '../components/ui/Button'

const features = [
  { icon: MessageSquare, label: 'Chat en tiempo real con reacciones y @menciones' },
  { icon: CheckSquare, label: 'Kanban de tareas con prioridades y fechas de entrega' },
  { icon: Layout, label: 'Tablón de anuncios del grupo' },
  { icon: Lightbulb, label: 'Post-its colaborativos en lienzo compartido' },
  { icon: Paperclip, label: 'Subida y gestión de archivos del grupo' },
  { icon: Users, label: 'Grupos y miembros ilimitados' },
  { icon: Zap, label: 'Actualizaciones en tiempo real' },
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark text-ink dark:text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-ink-3 dark:text-white/40 hover:text-ink dark:hover:text-white transition-colors mb-12"
        >
          <ArrowLeft size={15} /> Volver al inicio
        </Link>

        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-faint text-primary dark:text-primary-dark text-sm font-semibold rounded-full mb-6">
            <Sparkles size={14} /> Sin coste, sin trampas
          </span>
          <h1 className="font-display text-5xl font-bold mb-4">GroupUp es gratis</h1>
          <p className="text-lg text-ink-2 dark:text-white/60 max-w-md mx-auto">
            Todo incluido, para todos. Sin planes de pago, sin tarjeta de crédito, sin límites ocultos.
          </p>
        </div>

        <div className="bg-surface dark:bg-surface-dark rounded-2xl border border-border dark:border-white/8 p-8 mb-10">
          <p className="text-xs font-bold uppercase tracking-widest text-ink-4 dark:text-white/25 mb-6">Todo incluido, gratis para siempre</p>
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary-faint flex items-center justify-center text-primary flex-shrink-0">
                  <Icon size={16} />
                </div>
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link to="/auth?tab=register">
            <Button size="lg" className="gap-2">
              Crear cuenta gratis <ArrowRight size={16} />
            </Button>
          </Link>
          <p className="text-xs text-ink-4 dark:text-white/25 mt-4">Sin tarjeta de crédito. Sin límites de tiempo.</p>
        </div>
      </div>
    </div>
  )
}
