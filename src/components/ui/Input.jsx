import { clsx } from 'clsx'
import { forwardRef } from 'react'

const base = 'w-full bg-surface dark:bg-surface-dark border border-border-2 dark:border-white/10 rounded text-sm text-ink dark:text-white placeholder:text-ink-4 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-shadow'

export const Input = forwardRef(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={clsx(base, 'h-9 px-3', className)}
      {...props}
    />
  )
})

export const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={clsx(base, 'px-3 py-2 resize-none', className)}
      {...props}
    />
  )
})

export function Label({ children, className, ...props }) {
  return (
    <label className={clsx('block text-xs font-medium text-ink-2 dark:text-white/60 mb-1', className)} {...props}>
      {children}
    </label>
  )
}

export function FormField({ label, error, children, className }) {
  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      {label && <Label>{label}</Label>}
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
