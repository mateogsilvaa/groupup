import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageSquare, CheckSquare, Layout, Lightbulb, ArrowRight, Users, Zap, Shield, Check, Star } from 'lucide-react'
import Button from '../components/ui/Button'
import useStore from '../store/useStore'

const features = [
  { icon: MessageSquare, title: 'Chat en tiempo real', desc: 'Mensajes, reacciones emoji y @menciones. Todo el contexto en un hilo.' },
  { icon: CheckSquare, title: 'Kanban de tareas', desc: 'Arrastra y suelta tareas. Asigna prioridades, responsables y fechas.' },
  { icon: Layout, title: 'Tablón de grupo', desc: 'Anuncios, actualizaciones y recursos importantes siempre visibles.' },
  { icon: Lightbulb, title: 'Ideas colaborativas', desc: 'Post-its arrastrables en un lienzo compartido. Vota las mejores.' },
]

const steps = [
  { n: '01', title: 'Crea o únete a un grupo', desc: 'Con un solo clic o un código de invitación.' },
  { n: '02', title: 'Invita a tu equipo', desc: 'Comparte el código o enlace con quien quieras.' },
  { n: '03', title: 'Colabora sin fricción', desc: 'Chat, tareas, archivos e ideas en un solo lugar.' },
]

const plans = [
  {
    name: 'Free', price: '0', period: '',
    features: ['Hasta 3 grupos', '500 MB almacenamiento', 'Historial de 30 días', 'Chat + Tareas + Ideas'],
    cta: 'Empezar gratis', highlight: false,
  },
  {
    name: 'Estudiante', price: '1,99', period: '/mes',
    features: ['Grupos ilimitados', '5 GB almacenamiento', 'Historial ilimitado', 'Verificación .edu', 'Todo Free + Board'],
    cta: 'Activar plan Estudiante', highlight: true,
  },
  {
    name: 'Team', price: '4,99', period: '/mes',
    features: ['Todo ilimitado', '20 GB almacenamiento', 'Analíticas del equipo', 'Exportar datos', 'Soporte dedicado'],
    cta: 'Hablar con ventas', highlight: false,
  },
]

const testimonials = [
  { name: 'Lucía M.', role: 'Estudiante de Diseño, UPM', text: 'Usamos GroupUp para el TFG y fue un game-changer. Nada de WhatsApp, todo organizado en un sitio.' },
  { name: 'Alejandro R.', role: 'Ing. Informática, UAM', text: 'El kanban con fechas en color nos salvó de perder entregas. Y los templates al crear el grupo son geniales.' },
  { name: 'Sara V.', role: 'Erasmus, Salamanca', text: 'Me lo recomendaron para el proyecto de lab. Fácil, rápido y sin dramas de configuración.' },
]

function Navbar() {
  const { theme, toggleTheme } = useStore()
  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 flex items-center px-6 md:px-10 bg-bg/80 dark:bg-bg-dark/80 backdrop-blur-md border-b border-border dark:border-white/8">
      <span className="font-display text-xl font-bold text-primary flex-1">GroupUp</span>
      <nav className="hidden md:flex items-center gap-6 text-sm text-ink-2 dark:text-white/60 mr-6">
        <a href="#features" className="hover:text-ink dark:hover:text-white transition-colors">Funciones</a>
        <a href="#pricing" className="hover:text-ink dark:hover:text-white transition-colors">Precios</a>
        <Link to="/pricing" className="hover:text-ink dark:hover:text-white transition-colors">Pricing</Link>
      </nav>
      <div className="flex items-center gap-3">
        <button onClick={toggleTheme} className="w-8 h-8 flex items-center justify-center rounded text-ink-3 dark:text-white/40 hover:bg-surface-2 dark:hover:bg-surface-dark-2 transition-colors text-xs">
          {theme === 'dark' ? '☀' : '☾'}
        </button>
        <Link to="/auth">
          <Button variant="ghost" size="sm">Iniciar sesión</Button>
        </Link>
        <Link to="/auth?tab=register">
          <Button size="sm">Registro gratis</Button>
        </Link>
      </div>
    </header>
  )
}

const fade = { hidden: { opacity: 0, y: 16 }, show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.45 } }) }

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark text-ink dark:text-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 md:px-10 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-faint text-primary dark:text-primary-dark text-xs font-semibold rounded-full mb-6">
            <Zap size={12} /> Hecho para equipos universitarios
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold leading-[1.12] mb-6 max-w-3xl">
            Deja el <span className="text-primary">caos de WhatsApp</span><br />donde se merece
          </h1>
          <p className="text-lg text-ink-2 dark:text-white/60 mb-10 max-w-xl">
            Chat, tareas con fechas de entrega, archivos e ideas en un solo sitio. Sin apps extra, sin hilos perdidos, sin sustos.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link to="/auth?tab=register">
              <Button size="lg" className="gap-2">
                Empezar gratis <ArrowRight size={16} />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg">Ver funciones</Button>
            </a>
          </div>
        </motion.div>

        {/* Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-16 rounded-xl border border-border dark:border-white/8 shadow-4 overflow-hidden bg-surface dark:bg-surface-dark"
        >
          <div className="h-8 flex items-center gap-1.5 px-4 border-b border-border dark:border-white/8 bg-surface-2 dark:bg-surface-dark-2">
            {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-border-3 dark:bg-white/20" />)}
            <span className="mx-auto text-xs text-ink-4 dark:text-white/20">groupup.app/group/design-team/chat</span>
          </div>
          <div className="flex h-64">
            <div className="w-40 border-r border-border dark:border-white/8 p-3 flex flex-col gap-1 bg-surface dark:bg-surface-dark">
              {['Chat','Tareas','Tablón','Archivos','Ideas'].map(l => (
                <div key={l} className={`px-2.5 py-1.5 rounded text-xs ${l==='Chat' ? 'bg-primary-faint text-primary dark:text-primary-dark font-medium' : 'text-ink-3 dark:text-white/30'}`}>{l}</div>
              ))}
            </div>
            <div className="flex-1 p-4 flex flex-col gap-2 overflow-hidden">
              {[
                { n: 'Ana', msg: '¿Alguien puede revisar el diseño de onboarding?', me: false },
                { n: 'Carlos', msg: 'Lo miro ahora mismo 👍', me: false },
                { n: 'Tú', msg: 'Ya lo tengo asignado en tareas', me: true },
              ].map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.me ? 'flex-row-reverse' : ''}`}>
                  <div className="w-7 h-7 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                    {m.n[0]}
                  </div>
                  <div className={`max-w-[60%] px-3 py-1.5 rounded text-xs ${m.me ? 'bg-primary text-white' : 'bg-surface-2 dark:bg-surface-dark-2 text-ink dark:text-white'}`}>
                    {m.msg}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 md:px-10 max-w-5xl mx-auto">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.p variants={fade} custom={0} className="text-sm font-semibold text-primary mb-3">Funciones</motion.p>
          <motion.h2 variants={fade} custom={1} className="font-display text-4xl font-bold mb-4">Todo lo que necesita tu equipo</motion.h2>
          <motion.p variants={fade} custom={2} className="text-ink-2 dark:text-white/60 mb-12 max-w-lg">Diseñado para equipos que quieren ir rápido sin perder el hilo.</motion.p>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} variants={fade} custom={i + 3} className="bg-surface dark:bg-surface-dark rounded-lg p-6 border border-border dark:border-white/8 hover:shadow-2 transition-shadow">
                <div className="w-9 h-9 rounded bg-primary-faint flex items-center justify-center text-primary mb-4">
                  <Icon size={18} />
                </div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-ink-2 dark:text-white/60">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 md:px-10 bg-surface-2 dark:bg-surface-dark-2">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold text-primary mb-3">Cómo funciona</p>
          <h2 className="font-display text-4xl font-bold mb-12">Tres pasos para empezar</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ n, title, desc }, i) => (
              <motion.div
                key={n}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl font-display font-bold text-primary/20 dark:text-primary/30 mb-3">{n}</div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-ink-2 dark:text-white/60">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 md:px-10 max-w-5xl mx-auto">
        <p className="text-sm font-semibold text-primary mb-3">Precios</p>
        <h2 className="font-display text-4xl font-bold mb-4">Planes para cada equipo</h2>
        <p className="text-ink-2 dark:text-white/60 mb-12">Sin sorpresas, sin compromisos anuales forzados.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(({ name, price, period, features: fs, cta, highlight }) => (
            <div key={name} className={`rounded-lg p-6 border flex flex-col ${highlight ? 'border-primary bg-primary-faint dark:bg-primary/10' : 'border-border dark:border-white/8 bg-surface dark:bg-surface-dark'}`}>
              <div className="mb-1 text-sm font-semibold text-ink-2 dark:text-white/60">{name}</div>
              <div className="flex items-end gap-1 mb-6">
                <span className="font-display text-4xl font-bold">{price === '0' ? 'Gratis' : `€${price}`}</span>
                {period && <span className="text-ink-3 dark:text-white/40 text-sm mb-1">{period}</span>}
              </div>
              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {fs.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check size={14} className="text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/auth?tab=register">
                <Button variant={highlight ? 'primary' : 'outline'} className="w-full">{cta}</Button>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 md:px-10 bg-surface-2 dark:bg-surface-dark-2">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold text-primary mb-3">Testimonios</p>
          <h2 className="font-display text-4xl font-bold mb-12">Lo que dicen los equipos</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text }) => (
              <div key={name} className="bg-surface dark:bg-surface-dark rounded-lg p-5 border border-border dark:border-white/8">
                <div className="flex mb-3">
                  {[0,1,2,3,4].map(i => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm text-ink-2 dark:text-white/60 mb-4">"{text}"</p>
                <div>
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-ink-3 dark:text-white/40">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 md:px-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-4xl font-bold mb-4">Empieza hoy, gratis</h2>
          <p className="text-ink-2 dark:text-white/60 mb-8">Sin tarjeta de crédito. Sin límite de tiempo en el plan Free.</p>
          <Link to="/auth?tab=register">
            <Button size="lg" className="gap-2">
              Crear cuenta gratis <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border dark:border-white/8 py-8 px-6 md:px-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-ink-3 dark:text-white/30">
          <span className="font-display font-bold text-primary">GroupUp</span>
          <div className="flex gap-6">
            <Link to="/pricing" className="hover:text-ink dark:hover:text-white transition-colors">Precios</Link>
            <a href="mailto:hola@groupup.app" className="hover:text-ink dark:hover:text-white transition-colors">Contacto</a>
          </div>
          <span>© 2025 GroupUp</span>
        </div>
      </footer>
    </div>
  )
}
