import { create } from 'zustand'

let id = 0

const useToastStore = create((set) => ({
  toasts: [],
  add: (toast) => {
    const tid = ++id
    set(s => ({ toasts: [...s.toasts, { id: tid, ...toast }] }))
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== tid) }))
    }, toast.duration || 4000)
  },
  remove: (tid) => set(s => ({ toasts: s.toasts.filter(t => t.id !== tid) })),
}))

export function useToast() {
  const add = useToastStore(s => s.add)
  return {
    toast: (msg, type = 'default') => add({ msg, type }),
    success: (msg) => add({ msg, type: 'success' }),
    error: (msg) => add({ msg, type: 'error' }),
    info: (msg) => add({ msg, type: 'info' }),
  }
}

export { useToastStore }
