import { clsx } from 'clsx'
import { initials } from '../../utils/format'

const sizes = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
  xl: 'w-14 h-14 text-lg',
}

export default function Avatar({ name, url, size = 'md', className }) {
  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={clsx('rounded-full object-cover flex-shrink-0', sizes[size], className)}
      />
    )
  }
  return (
    <div className={clsx(
      'rounded-full bg-primary text-white font-semibold flex items-center justify-center flex-shrink-0 select-none',
      sizes[size],
      className,
    )}>
      {initials(name)}
    </div>
  )
}
