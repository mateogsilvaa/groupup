import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MessageSquare, CheckSquare, Layout, Lightbulb, ArrowRight, Zap, Star,
  Users, Clock, Lock, Sparkles, ChevronRight, Menu, X, Send, Plus, Download
} from 'lucide-react'
import Button from '../components/ui/Button'
import useStore from '../store/useStore'

const features = [
  {
    icon: MessageSquare,
    title: 'Chat en tiempo real',
    desc: 'Conversación fluida con @menciones y reacciones. Todo sincronizado al instante.',
    color: 'from-blue-500/10 to-cyan-500/10'
  },
  {
    icon: CheckSquare,
    title: 'Kanban de tareas',
    desc: 'Arrastra tareas entre columnas. Asigna, prioriza y controla fechas de entrega.',
    color: 'from-emerald-500/10 to-teal-500/10'
  },
  {
    icon: Layout,
    title: 'Tablón de grupo',
    desc: 'Anuncios fijados, actualizaciones importantes, recursos centralizados.',
    color: 'from-amber-500/10 to-orange-500/10'
  },
  {
    icon: Lightbulb,
    title: 'Ideas colaborativas',
    desc: 'Lienzo compartido con post-its arrastrables. Vota y destaca las mejores.',
    color: 'from-violet-500/10 to-purple-500/10'
  },
]

const steps = [
  {
    n: '01',
    title: 'Crea o únete a un grupo',
    desc: 'Un clic para crear. Código de invitación para unirse.',
    icon: Plus
  },
  {
    n: '02',
    title: 'Invita a tu equipo',
    desc: 'Comparte el enlace y empiezan a colaborar al instante.',
    icon: Send
  },
  {
    n: '03',
    title: 'Colabora sin fricción',
    desc: 'Chat, tareas, archivos e ideas en un solo lugar.',
    icon: Sparkles
  },
]

const testimonials = [
  {
    name: 'Adrián González',
    role: 'Estudiante de Ing. Software',
    text: 'GroupUp me salvó literalmente al final del primer año de carrera. Teníamos tres proyectos en paralelo con entregas encimadas y sin él habríamos naufragado. Ahora no concibo trabajar en grupo sin él.',
    initials: 'AG'
  },
  {
    name: 'Sofía Martín',
    role: 'Estudiante de ADE, UFV',
    text: 'Dejamos de perder el hilo en WhatsApp desde el primer día. Todo el grupo ve las tareas, los plazos y los archivos en el mismo sitio. Ha cambiado por completo cómo trabajamos.',
    initials: 'SM'
  },
  {
    name: 'Lucas González',
    role: 'Estudiante de la ESO',
    text: 'Pensé que era solo para la universidad, pero funciona genial también en el insti. Lo usé para un trabajo de Ciencias y fue mucho mejor que cualquier grupo de WhatsApp. Hasta para la ESO va de lujo.',
    initials: 'LG'
  },
]

const faqs = [
  { q: '¿Cuánto cuesta?', a: 'Es gratis. Sin límite de usuarios, grupos ni tiempo. Siempre.' },
  { q: '¿Necesito instalar algo?', a: 'Funciona directamente en el navegador. También hay app de escritorio para Windows y macOS si la prefieres.' },
  { q: '¿Mis datos están seguros?', a: 'Sí. Todo en Supabase con encriptación PostgreSQL. Nunca vendemos datos.' },
  { q: '¿Puedo invitar a la gente?', a: 'Sí. Código único por grupo + enlace directo + @ en chat.' },
]

function Navbar() {
  const { theme, toggleTheme } = useStore()
  const [mobileMenu, setMobileMenu] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 h-16 flex items-center px-6 md:px-10 bg-bg/95 dark:bg-bg-dark/95 backdrop-blur-sm border-b border-border dark:border-white/8">
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-display text-xl font-bold text-primary flex-1"
      >
        GroupUp
      </motion.span>

      <nav className="hidden md:flex items-center gap-8 text-sm text-ink-2 dark:text-white/60 mr-8">
        <a href="#features" className="hover:text-primary transition-colors duration-200">Funciones</a>
        <a href="#how" className="hover:text-primary transition-colors duration-200">Cómo</a>
        <a href="#download" className="hover:text-primary transition-colors duration-200">Descargar</a>
        <a href="#faq" className="hover:text-primary transition-colors duration-200">FAQ</a>
      </nav>

      <div className="hidden md:flex items-center gap-3">
        <button
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-surface-2 dark:hover:bg-surface-dark-2 transition-colors duration-150"
        >
          <span className="text-lg">{theme === 'dark' ? '☀' : '☾'}</span>
        </button>
        <Link to="/auth">
          <Button variant="ghost" size="sm" className="hover:bg-surface-2 dark:hover:bg-surface-dark-2">
            Iniciar sesión
          </Button>
        </Link>
        <Link to="/auth?tab=register">
          <Button size="sm">Registro gratis</Button>
        </Link>
      </div>

      <button
        onClick={() => setMobileMenu(!mobileMenu)}
        className="md:hidden ml-4 w-8 h-8 flex items-center justify-center rounded hover:bg-surface-2 dark:hover:bg-surface-dark-2"
      >
        {mobileMenu ? <X size={20} /> : <Menu size={20} />}
      </button>

      {mobileMenu && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-16 inset-x-0 bg-bg dark:bg-bg-dark border-b border-border dark:border-white/8 p-4 flex flex-col gap-3"
        >
          <a href="#features" className="text-sm hover:text-primary">Funciones</a>
          <a href="#how" className="text-sm hover:text-primary">Cómo</a>
          <a href="#download" className="text-sm hover:text-primary">Descargar</a>
          <Link to="/auth?tab=register" className="w-full">
            <Button size="sm" className="w-full">Registro gratis</Button>
          </Link>
        </motion.div>
      )}
    </header>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
}

export default function Landing() {
  const [hoveredFeature, setHoveredFeature] = useState(null)

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark text-ink dark:text-white overflow-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 md:px-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute -top-40 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        />

        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="relative z-10"
        >
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-faint dark:bg-primary-dark/10 text-primary dark:text-primary-dark text-xs font-semibold rounded-full mb-6 border border-primary/20 dark:border-primary-dark/30"
          >
            <Zap size={14} /> Hecho para equipos universitarios
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="font-display text-5xl md:text-7xl font-bold leading-[1.15] mb-8 max-w-4xl"
          >
            Deja el <span className="text-primary">caos de WhatsApp</span>{' '}
            <span className="text-ink-2 dark:text-white/60">donde merece estar</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-ink-2 dark:text-white/60 mb-10 max-w-2xl leading-relaxed"
          >
            Chat, tareas con fechas de entrega, archivos e ideas. Todo en un sitio.
            Sin apps extra, sin hilos perdidos, sin sustos de último minuto.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 flex-wrap"
          >
            <Link to="/auth?tab=register" className="group">
              <Button
                size="lg"
                className="gap-2 group-hover:shadow-lg transition-shadow duration-300"
              >
                Empezar gratis <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
            <a href="#download">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 hover:bg-surface-2 dark:hover:bg-surface-dark-2 transition-colors duration-300"
              >
                <Download size={18} /> Descargar app
              </Button>
            </a>
          </motion.div>
        </motion.div>

        {/* Interactive Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-20 relative"
        >
          <div className="absolute inset-0 bg-primary/10 dark:bg-primary/5 rounded-2xl blur-2xl" />
          <div className="relative rounded-2xl border border-border dark:border-white/10 shadow-2xl overflow-hidden bg-surface dark:bg-surface-dark">
            {/* Browser bar */}
            <div className="h-10 flex items-center gap-2 px-4 border-b border-border dark:border-white/8 bg-surface-2 dark:bg-surface-dark-2">
              {[0,1,2].map(i => <div key={i} className="w-3 h-3 rounded-full bg-border-3 dark:bg-white/20" />)}
              <span className="mx-auto text-xs text-ink-4 dark:text-white/30">groupup.app/grupo/design-team</span>
            </div>

            {/* Content */}
            <div className="flex h-64">
              {/* Sidebar */}
              <div className="w-44 border-r border-border dark:border-white/8 p-4 flex flex-col gap-2 bg-surface-2 dark:bg-surface-dark-2">
                {['Chat','Tareas','Tablón','Archivos','Ideas'].map((tab, i) => (
                  <motion.div
                    key={tab}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className={`px-3 py-2 rounded text-sm font-medium transition-all duration-200 cursor-pointer ${
                      tab === 'Chat'
                        ? 'bg-primary text-white'
                        : 'text-ink-3 dark:text-white/40 hover:bg-surface-3 dark:hover:bg-surface-dark-3'
                    }`}
                  >
                    {tab}
                  </motion.div>
                ))}
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 flex flex-col gap-3 overflow-hidden">
                {[
                  { name: 'Ana', msg: '¿Alguien mira el diseño de onboarding?', mine: false, delay: 0.55 },
                  { name: 'Carlos', msg: 'Yo lo hago en 30 min', mine: false, delay: 0.6 },
                  { name: 'Tú', msg: 'Perfecto, lo asigno en tareas', mine: true, delay: 0.65 },
                ].map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ x: m.mine ? 50 : -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: m.delay }}
                    className={`flex gap-2 ${m.mine ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {m.name[0]}
                    </div>
                    <div className={`max-w-[65%] px-3 py-2 rounded-lg text-sm ${
                      m.mine
                        ? 'bg-primary text-white'
                        : 'bg-surface-3 dark:bg-surface-dark-3 text-ink dark:text-white'
                    }`}>
                      {m.msg}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Download */}
      <section id="download" className="py-20 px-6 md:px-10 bg-surface-2 dark:bg-surface-dark-2">
        <div className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-primary mb-3"
          >
            App de escritorio
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-display text-3xl md:text-4xl font-bold mb-4"
          >
            Descarga GroupUp para tu ordenador
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-ink-2 dark:text-white/60 mb-10"
          >
            Disponible para Windows y macOS. También funciona directamente en el navegador.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a href="/downloads/GroupUp-Setup-Windows.exe" download className="group">
              <div className="flex items-center gap-4 px-6 py-4 rounded-xl border border-border dark:border-white/10 bg-surface dark:bg-surface-dark hover:border-primary/40 dark:hover:border-primary-dark/40 hover:shadow-md transition-all duration-300 cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 flex-shrink-0">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-ink-3 dark:text-white/40 mb-0.5">Descargar para</p>
                  <p className="font-semibold text-sm">Windows</p>
                </div>
                <Download size={16} className="ml-auto text-ink-3 dark:text-white/40 group-hover:text-primary transition-colors duration-200" />
              </div>
            </a>

            <a href="/downloads/GroupUp-Setup-Mac.dmg" download className="group">
              <div className="flex items-center gap-4 px-6 py-4 rounded-xl border border-border dark:border-white/10 bg-surface dark:bg-surface-dark hover:border-primary/40 dark:hover:border-primary-dark/40 hover:shadow-md transition-all duration-300 cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center text-gray-500 flex-shrink-0">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-ink-3 dark:text-white/40 mb-0.5">Descargar para</p>
                  <p className="font-semibold text-sm">macOS</p>
                </div>
                <Download size={16} className="ml-auto text-ink-3 dark:text-white/40 group-hover:text-primary transition-colors duration-200" />
              </div>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 md:px-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16"
        >
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-primary mb-3"
          >
            Funciones
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl md:text-5xl font-bold mb-6"
          >
            Todo lo que tu equipo necesita
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-ink-2 dark:text-white/60 max-w-2xl"
          >
            Pensado para que equipos universitarios vayan rápido sin perder el hilo.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              variants={itemVariants}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
              className="group relative rounded-xl p-6 border border-border dark:border-white/8 bg-surface dark:bg-surface-dark overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary/30 dark:hover:border-primary-dark/30 cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative z-10">
                <div className="w-11 h-11 rounded-lg bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center text-primary dark:text-primary-dark mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-base mb-2">{title}</h3>
                <p className="text-sm text-ink-2 dark:text-white/60 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-6 md:px-10 bg-surface-2 dark:bg-surface-dark-2">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            className="mb-16"
          >
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-semibold text-primary mb-3"
            >
              Cómo funciona
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="font-display text-4xl md:text-5xl font-bold"
            >
              Tres pasos, cero complicaciones
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8 relative"
          >
            <div className="hidden md:block absolute top-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            {steps.map(({ n, title, desc }) => (
              <motion.div
                key={n}
                variants={itemVariants}
                className="relative"
              >
                <div className="flex flex-col items-start">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-12 h-12 rounded-full bg-primary text-white font-display font-bold text-lg flex items-center justify-center mb-6 relative z-10"
                  >
                    {n}
                  </motion.div>
                  <h3 className="font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-sm text-ink-2 dark:text-white/60 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 md:px-10 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="mb-16"
        >
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-primary mb-3"
          >
            Testimonios
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="font-display text-4xl md:text-5xl font-bold"
          >
            Lo que dicen quienes lo usan
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map(({ name, role, text, initials }) => (
            <motion.div
              key={name}
              variants={itemVariants}
              whileHover={{ y: -8 }}
              className="bg-surface dark:bg-surface-dark rounded-xl p-6 border border-border dark:border-white/8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-ink-2 dark:text-white/60 mb-6 leading-relaxed">"{text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-ink-3 dark:text-white/40">{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 md:px-10 bg-surface-2 dark:bg-surface-dark-2">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            className="mb-12 text-center"
          >
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm font-semibold text-primary mb-3"
            >
              Preguntas frecuentes
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="font-display text-4xl font-bold"
            >
              Lo que tienes que saber
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={containerVariants}
            className="space-y-4"
          >
            {faqs.map(({ q, a }) => (
              <motion.div
                key={q}
                variants={itemVariants}
                className="bg-surface dark:bg-surface-dark rounded-lg p-6 border border-border dark:border-white/8 hover:border-primary/30 dark:hover:border-primary-dark/30 transition-colors duration-300"
              >
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <ChevronRight size={18} className="text-primary" /> {q}
                </h3>
                <p className="text-sm text-ink-2 dark:text-white/60 ml-6">{a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-bold mb-4"
          >
            Empieza hoy, gratis
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="text-lg text-ink-2 dark:text-white/60 mb-10"
          >
            Sin tarjeta de crédito. Sin límite de usuarios ni grupos. Sin sorpresas.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Link to="/auth?tab=register" className="group inline-block">
              <Button
                size="lg"
                className="gap-2 group-hover:shadow-lg transition-shadow duration-300"
              >
                Crear cuenta gratis <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border dark:border-white/8 py-12 px-6 md:px-10 bg-surface-2 dark:bg-surface-dark-2">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <span className="font-display text-lg font-bold text-primary block mb-2">GroupUp</span>
              <p className="text-sm text-ink-3 dark:text-white/40">Colaboración hecha simple para equipos universitarios.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Producto</h4>
              <nav className="flex flex-col gap-2 text-sm text-ink-3 dark:text-white/40">
                <a href="#features" className="hover:text-primary transition-colors">Funciones</a>
                <a href="#how" className="hover:text-primary transition-colors">Cómo funciona</a>
                <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
              </nav>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Legal</h4>
              <nav className="flex flex-col gap-2 text-sm text-ink-3 dark:text-white/40">
                <a href="#" className="hover:text-primary transition-colors">Privacidad</a>
                <a href="#" className="hover:text-primary transition-colors">Términos</a>
              </nav>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4">Contacto</h4>
              <a href="mailto:contact.groupup@proton.me" className="text-sm text-ink-3 dark:text-white/40 hover:text-primary transition-colors">contact.groupup@proton.me</a>
            </div>
          </div>

          <div className="border-t border-border dark:border-white/8 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-ink-3 dark:text-white/30">
            <span>© 2025 GroupUp. Hecho con cuidado.</span>
            <span>Construido para equipos que quieren ir rápido.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
