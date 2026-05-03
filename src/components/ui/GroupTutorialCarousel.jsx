import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, MessageSquare, CheckSquare, Layout, Lightbulb, Users, X } from 'lucide-react'
import Button from './Button'

function getSlides(groupName) {
  return [
    {
      icon: Layout,
      color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
      title: `Bienvenido a "${groupName}"`,
      desc: 'Tu grupo ya está listo. GroupUp reúne todo lo que necesitas para trabajar en equipo: chat, tareas, archivos e ideas en un solo lugar.',
      tips: ['Chat en tiempo real con tu equipo', 'Tablón de tareas tipo Kanban', 'Archivos e ideas compartidas'],
    },
    {
      icon: CheckSquare,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      title: 'Crea y organiza tareas',
      desc: 'El tablón Kanban tiene tres columnas: Por hacer, En progreso y Hecho. Crea tareas y arrastra las tarjetas para cambiar su estado.',
      tips: ['Pulsa "Nueva tarea" para añadir una', 'Arrastra tarjetas entre columnas', 'Define prioridad alta, media o baja'],
    },
    {
      icon: Users,
      color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
      title: 'Asigna tareas a miembros',
      desc: 'Al crear una tarea puedes elegir quién se encarga. Todos los miembros del grupo estarán disponibles para asignar responsabilidades.',
      tips: ['Elige el responsable al crear la tarea', 'Filtra el tablón por persona', 'El avatar del responsable aparece en la tarjeta'],
    },
    {
      icon: MessageSquare,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      title: 'Comunícate con el chat',
      desc: 'El chat en tiempo real mantiene a todo el equipo conectado al instante. Los mensajes se envían al momento y el historial se guarda automáticamente.',
      tips: ['Escribe y pulsa Enter para enviar', 'El historial se guarda automáticamente', 'Comparte ideas y actualizaciones'],
    },
    {
      icon: Lightbulb,
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      title: 'Mucho más por explorar',
      desc: 'Además del chat y las tareas, tienes un Tablón para anuncios, una sección de Archivos en la nube y una pizarra de Ideas con post-its arrastrables.',
      tips: ['Tablón: anuncios y recursos del grupo', 'Archivos: sube documentos hasta 100MB', 'Ideas: lluvia de ideas colaborativa'],
    },
  ]
}

export default function GroupTutorialCarousel({ open, onClose, groupName }) {
  const [current, setCurrent] = useState(0)
  const slides = getSlides(groupName || 'tu grupo')

  useEffect(() => {
    if (open) setCurrent(0)
  }, [open])

  function goTo(n) {
    setCurrent(Math.max(0, Math.min(slides.length - 1, n)))
  }

  const slide = slides[current]
  const CurrentIcon = slide.icon

  console.log('GroupTutorialCarousel render, open=', open)
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

          <motion.div
            className="relative w-full max-w-xl bg-surface dark:bg-surface-dark rounded-2xl shadow-[0_32px_72px_-12px_rgba(0,0,0,0.55)] overflow-hidden"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-2">
              <span className="text-xs font-semibold text-primary dark:text-primary-dark tracking-wide uppercase">
                Tutorial de inicio
              </span>
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 text-xs text-ink-3 dark:text-white/40 hover:text-ink dark:hover:text-white transition-colors px-2 py-1 rounded hover:bg-surface-2 dark:hover:bg-surface-dark-2"
              >
                <X size={13} />
                Omitir
              </button>
            </div>

            <div className="px-6 pb-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className={`w-20 h-20 rounded-2xl ${slide.color} flex items-center justify-center mx-auto mb-5 mt-2`}>
                    <CurrentIcon size={40} />
                  </div>

                  <div className="text-center mb-6">
                    <p className="text-xs font-medium text-ink-4 dark:text-white/25 mb-1">
                      {current + 1} de {slides.length}
                    </p>
                    <h2 className="text-xl font-bold text-ink dark:text-white mb-3">{slide.title}</h2>
                    <p className="text-sm text-ink-2 dark:text-white/60 leading-relaxed">{slide.desc}</p>
                  </div>

                  <div className="bg-surface-2 dark:bg-surface-dark-2 rounded-xl p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-ink-4 dark:text-white/25 mb-3">
                      Lo más importante
                    </p>
                    <ul className="flex flex-col gap-2.5">
                      {slide.tips.map((tip, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-ink-2 dark:text-white/60">
                          <span className={`w-5 h-5 rounded-full ${slide.color} text-[10px] font-bold flex items-center justify-center flex-shrink-0`}>
                            {i + 1}
                          </span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex justify-center gap-1.5 mt-5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === current
                        ? 'w-8 bg-primary dark:bg-primary-dark'
                        : 'w-1.5 bg-border dark:bg-white/10 hover:bg-border-2'
                    }`}
                  />
                ))}
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => goTo(current - 1)}
                  disabled={current === 0}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border dark:border-white/8 text-sm text-ink-2 dark:text-white/60 hover:bg-surface-2 dark:hover:bg-surface-dark-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={15} />
                  Anterior
                </button>

                {current === slides.length - 1 ? (
                  <Button onClick={onClose} className="flex-1">
                    Empezar
                  </Button>
                ) : (
                  <button
                    onClick={() => goTo(current + 1)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Siguiente
                    <ChevronRight size={15} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
