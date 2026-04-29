import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns'
import { es } from 'date-fns/locale'

export function timeAgo(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: es })
}

export function chatTime(date) {
  const d = new Date(date)
  if (isToday(d)) return format(d, 'HH:mm')
  if (isYesterday(d)) return `Ayer ${format(d, 'HH:mm')}`
  return format(d, 'dd/MM/yyyy HH:mm')
}

export function fileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

export function initials(name) {
  if (!name) return '?'
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

export function truncate(str, n) {
  return str && str.length > n ? str.slice(0, n - 1) + '…' : str
}

export function planLabel(plan) {
  const map = { free: 'Free', pro: 'Pro', team: 'Team' }
  return map[plan] || 'Free'
}
