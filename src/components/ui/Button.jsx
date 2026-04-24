import { clsx } from 'clsx'

const variants = {
  primary: 'bg-primary text-white hover:bg-primary-hover active:scale-[.98]',
  secondary: 'bg-surface-2 dark:bg-surface-dark-2 text-ink dark:text-white hover:bg-surface-3 dark:hover:bg-surface-dark-3',
  ghost: 'bg-transparent text-ink dark:text-white hover:bg-surface-2 dark:hover:bg-surface-dark-2',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-[.98]',
  outline: 'border border-border-2 dark:border-white/10 bg-transparent text-ink dark:text-white hover:bg-surface-2 dark:hover:bg-surface-dark-2',
}

const sizes = {
  sm: 'h-8 px-3 text-sm rounded-sm',
  md: 'h-9 px-4 text-sm rounded',
  lg: 'h-11 px-6 text-base rounded-md',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  children,
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}
