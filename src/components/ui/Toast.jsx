import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { clsx } from 'clsx'

const styles = {
  success: 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700/40 text-emerald-800 dark:text-emerald-300',
  error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700/40 text-red-800 dark:text-red-300',
  info: 'bg-primary-faint dark:bg-primary/10 border-primary/20 text-primary-hover dark:text-primary-dark',
  default: 'bg-surface dark:bg-surface-dark-2 border-border-2 dark:border-white/10 text-ink dark:text-white',
}

const icons = {
  success: <CheckCircle size={16} />,
  error: <XCircle size={16} />,
  info: <Info size={16} />,
  default: null,
}

export default function Toast({ toast, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 12, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 12, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
      className={clsx(
        'flex items-center gap-2.5 px-4 py-3 rounded-md border shadow-2 text-sm max-w-sm',
        styles[toast.type] || styles.default,
      )}
    >
      {icons[toast.type]}
      <span className="flex-1">{toast.msg}</span>
      <button onClick={onClose} className="ml-1 opacity-50 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </motion.div>
  )
}
