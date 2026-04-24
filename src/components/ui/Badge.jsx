import { clsx } from 'clsx'

const variants = {
  default: 'bg-surface-2 dark:bg-surface-dark-2 text-ink-2 dark:text-white/60',
  primary: 'bg-primary-faint text-primary dark:text-primary-dark',
  pro: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  admin: 'bg-primary-faint2 text-primary dark:text-primary-dark',
}

export default function Badge({ variant = 'default', children, className }) {
  return (
    <span className={clsx(
      'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wide',
      variants[variant],
      className,
    )}>
      {children}
    </span>
  )
}
