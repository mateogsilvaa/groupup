import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, MessageSquare, CheckSquare, Layout, Lightbulb, Paperclip } from 'lucide-react'
import Modal from './Modal'
import Button from './Button'

const slides = [
  {
    icon: MessageSquare,
    title: 'Chat en tiempo real',
    desc: 'Comunícate con tu equipo instantáneamente. Usa @menciones para llamar la atención de alguien.',
    tips: ['Escribe / para ver comandos', 'React con emojis a los mensajes', 'Busca en el historial'],
  },
  {
    icon: CheckSquare,
    title: 'Kanban de tareas',
    desc: 'Organiza tu trabajo en columnas. Arrastra tareas para cambiar su estado.',
    tips: ['Asigna tareas a compañeros', 'Establece fechas de entrega', 'Usa prioridades (alta, media, baja)'],
  },
  {
    icon: Layout,
    title: 'Tablón de grupo',
    desc: 'Comparte anuncios y recursos importantes. Fija los más relevantes en la parte superior.',
    tips: ['Pública información para todos', 'Fija anuncios importantes', 'Busca publicaciones antiguas'],
  },
  {
    icon: Paperclip,
    title: 'Compartir archivos',
    desc: 'Sube documentos, imágenes y todo lo que necesites. Los archivos se guardan en la nube.',
    tips: ['Máximo 100MB por archivo', 'Acceso desde cualquier dispositivo', 'Descarga en cualquier momento'],
  },
  {
    icon: Lightbulb,
    title: 'Ideas colaborativas',
    desc: 'Lluvia de ideas con post-its arrastrables. Vota las mejores ideas del grupo.',
    tips: ['Arrastra post-its libremente', 'Vota las ideas que te gusten', 'Exporta las mejores ideas'],
  },
]

export default function GroupTutorialCarousel({ open, onClose, groupName }) {
  const [current, setCurrent] = useState(0)

  const goToSlide = (n) => {
    setCurrent((n + slides.length) % slides.length)
  }

  const CurrentIcon = slides[current].icon

  return (
    <Modal open={open} onClose={onClose}>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-primary mb-2">Bienvenido a {groupName}</p>
          <h2 className="text-2xl font-bold">Conoce las funciones</h2>
        </div>

        {/* Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="bg-surface-2 dark:bg-surface-dark-2 rounded-xl p-8 text-center mb-6"
          >
            <div className="w-16 h-16 rounded-xl bg-primary/10 dark:bg-primary-dark/10 flex items-center justify-center text-primary dark:text-primary-dark mx-auto mb-4">
              <CurrentIcon size={32} />
            </div>

            <h3 className="text-xl font-bold mb-2">{slides[current].title}</h3>
            <p className="text-sm text-ink-2 dark:text-white/60 mb-6 leading-relaxed">
              {slides[current].desc}
            </p>

            {/* Tips */}
            <div className="bg-surface dark:bg-surface-dark rounded-lg p-4 text-left">
              <p className="text-xs font-semibold text-ink-3 dark:text-white/40 mb-3 uppercase tracking-wide">Consejos</p>
              <ul className="space-y-2">
                {slides[current].tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink-2 dark:text-white/60">
                    <span className="w-5 h-5 rounded-full bg-primary/20 dark:bg-primary-dark/20 text-primary dark:text-primary-dark text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots & Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-8 bg-primary dark:bg-primary-dark'
                    : 'w-1.5 bg-border dark:bg-white/10 hover:bg-border-2'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-ink-3 dark:text-white/40">
            {current + 1} de {slides.length}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => goToSlide(current - 1)}
            disabled={current === 0}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-border dark:border-white/8 text-ink-2 dark:text-white/60 hover:bg-surface-2 dark:hover:bg-surface-dark-2 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
            Anterior
          </button>

          {current === slides.length - 1 ? (
            <Button onClick={onClose} className="flex-1">
              Entendido
            </Button>
          ) : (
            <button
              onClick={() => goToSlide(current + 1)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-white hover:bg-primary-hover transition-colors font-medium"
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        {/* Skip */}
        <button
          onClick={onClose}
          className="w-full mt-3 text-sm text-ink-3 dark:text-white/40 hover:text-ink dark:hover:text-white transition-colors"
        >
          Saltar tutorial
        </button>
      </div>
    </Modal>
  )
}
