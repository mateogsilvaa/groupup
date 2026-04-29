import { clsx } from 'clsx'

export default function Empty({ icon: Icon, title, description, action, className }) {
  return (
    <div className={clsx('flex flex-col items-center justify-center gap-3 py-16 text-center', className)}>
      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-surface-2 dark:bg-surface-dark-2 flex items-center justify-center text-ink-3 dark:text-white/30">
          <Icon size={22} />
        </div>
      )}
      <div>
        <p className="font-medium text-ink dark:text-white">{title}</p>
        {description && <p className="text-sm text-ink-3 dark:text-white/40 mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
  )
}
