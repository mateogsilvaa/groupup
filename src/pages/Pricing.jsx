import { Link } from 'react-router-dom'
import { Check, ArrowLeft, GraduationCap } from 'lucide-react'
import Button from '../components/ui/Button'

const plans = [
  {
    name: 'Free',
    price: '0',
    period: '',
    badge: null,
    features: [
      'Hasta 3 grupos',
      'Hasta 5 miembros por grupo',
      'Chat + Tareas + Ideas',
      '500 MB almacenamiento',
      'Historial de 30 días',
      'Soporte por email',
    ],
    cta: 'Empezar gratis',
    to: '/auth?tab=register',
    highlight: false,
  },
  {
    name: 'Estudiante',
    price: '1,99',
    period: '/mes',
    badge: 'Para universitarios',
    features: [
      'Grupos ilimitados',
      'Miembros ilimitados',
      'Todo Free + Board + Archivos',
      '5 GB almacenamiento',
      'Historial ilimitado',
      'Verificación con email .edu',
      'Prioridad en soporte',
    ],
    cta: 'Activar plan Estudiante',
    to: '/auth?tab=register',
    highlight: true,
  },
  {
    name: 'Team',
    price: '4,99',
    period: '/mes',
    badge: null,
    features: [
      'Todo ilimitado',
      '20 GB almacenamiento',
      'Analíticas del equipo',
      'Exportar datos',
      'Roles personalizados',
      'Soporte dedicado',
    ],
    cta: 'Hablar con ventas',
    to: 'mailto:ventas@groupup.app',
    highlight: false,
  },
]

export default function Pricing() {
  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark text-ink dark:text-white">
      <div className="max-w-5xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-ink-3 dark:text-white/40 hover:text-ink dark:hover:text-white transition-colors mb-12">
          <ArrowLeft size={15} /> Volver al inicio
        </Link>

        <p className="text-sm font-semibold text-primary mb-3">Precios</p>
        <h1 className="font-display text-5xl font-bold mb-4">Hecho para estudiantes</h1>
        <p className="text-ink-2 dark:text-white/60 mb-16 max-w-lg">
          Sin sorpresas, sin compromisos anuales. Cancela cuando quieras.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(({ name, price, period, badge, features, cta, to, highlight }) => (
            <div
              key={name}
              className={`rounded-xl p-6 border flex flex-col ${
                highlight
                  ? 'border-primary shadow-3 bg-surface dark:bg-surface-dark'
                  : 'border-border dark:border-white/8 bg-surface dark:bg-surface-dark'
              }`}
            >
              {badge && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary-faint px-2 py-0.5 rounded-full self-start mb-4">
                  <GraduationCap size={11} /> {badge}
                </span>
              )}
              <div className="text-sm font-semibold text-ink-2 dark:text-white/60 mb-1">{name}</div>
              <div className="flex items-end gap-1 mb-6">
                <span className="font-display text-4xl font-bold">
                  {price === '0' ? 'Gratis' : `€${price}`}
                </span>
                {period && <span className="text-ink-3 dark:text-white/40 text-sm mb-1">{period}</span>}
              </div>
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={14} className="text-primary flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              {to.startsWith('mailto') ? (
                <a href={to}>
                  <Button variant={highlight ? 'primary' : 'outline'} className="w-full">{cta}</Button>
                </a>
              ) : (
                <Link to={to}>
                  <Button variant={highlight ? 'primary' : 'outline'} className="w-full">{cta}</Button>
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-primary-faint dark:bg-primary/5 rounded-xl border border-primary/20 text-center">
          <GraduationCap size={24} className="text-primary mx-auto mb-3" />
          <h3 className="font-semibold text-lg mb-2">Verificación .edu</h3>
          <p className="text-sm text-ink-2 dark:text-white/60 max-w-md mx-auto">
            Si tienes un email universitario (.edu, .upm.es, .uam.es…) obtienes el plan Estudiante al precio especial.
            Verificación automática al registrarte.
          </p>
        </div>

        <div className="mt-8 p-8 bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-white/8 text-center">
          <h3 className="font-semibold text-lg mb-2">¿Tienes alguna duda?</h3>
          <p className="text-sm text-ink-2 dark:text-white/60 mb-4">Respondemos en menos de 24 horas.</p>
          <a href="mailto:hola@groupup.app">
            <Button variant="outline">Contactar</Button>
          </a>
        </div>
      </div>
    </div>
  )
}
