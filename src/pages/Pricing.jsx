import { Link } from 'react-router-dom'
import { Check, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'

const plans = [
  {
    name: 'Free', price: '0', period: '',
    features: ['1 grupo', 'Hasta 5 miembros', 'Chat + Tareas básicas', '100 MB almacenamiento', 'Soporte por email'],
    cta: 'Empezar gratis', to: '/auth?tab=register', highlight: false,
  },
  {
    name: 'Pro', price: '9', period: '/mes',
    features: ['5 grupos', 'Miembros ilimitados', 'Todo Free + Board + Ideas', '5 GB almacenamiento', 'Prioridad en soporte', 'Historial ilimitado'],
    cta: 'Probar Pro', to: '/auth?tab=register', highlight: true,
  },
  {
    name: 'Team', price: '19', period: '/mes',
    features: ['Grupos ilimitados', 'Miembros ilimitados', 'Todo Pro + API + SSO', '50 GB almacenamiento', 'Soporte dedicado', 'SLA garantizado', 'Facturas personalizadas'],
    cta: 'Hablar con ventas', to: 'mailto:ventas@groupup.app', highlight: false,
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
        <h1 className="font-display text-5xl font-bold mb-4">Planes para cada equipo</h1>
        <p className="text-ink-2 dark:text-white/60 mb-16 max-w-lg">Sin compromisos anuales forzados. Cancela cuando quieras.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(({ name, price, period, features, cta, to, highlight }) => (
            <div key={name} className={`rounded-xl p-6 border flex flex-col ${highlight ? 'border-primary shadow-3' : 'border-border dark:border-white/8 bg-surface dark:bg-surface-dark'}`}>
              {highlight && <span className="text-xs font-semibold text-primary bg-primary-faint px-2 py-0.5 rounded self-start mb-4">Más popular</span>}
              <div className="text-sm font-semibold text-ink-2 dark:text-white/60 mb-1">{name}</div>
              <div className="flex items-end gap-1 mb-6">
                <span className="font-display text-4xl font-bold">{price === '0' ? 'Gratis' : `€${price}`}</span>
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
                <a href={to}><Button variant={highlight ? 'primary' : 'outline'} className="w-full">{cta}</Button></a>
              ) : (
                <Link to={to}><Button variant={highlight ? 'primary' : 'outline'} className="w-full">{cta}</Button></Link>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-surface dark:bg-surface-dark rounded-xl border border-border dark:border-white/8 text-center">
          <h3 className="font-semibold text-lg mb-2">¿Tienes preguntas?</h3>
          <p className="text-sm text-ink-2 dark:text-white/60 mb-4">Nuestro equipo responde en menos de 24 horas.</p>
          <a href="mailto:hola@groupup.app">
            <Button variant="outline">Contactar</Button>
          </a>
        </div>
      </div>
    </div>
  )
}
