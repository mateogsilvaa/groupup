import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import useStore from './store/useStore'
import { supabase } from './lib/supabase'
import { useToastStore } from './hooks/useToast'
import Toast from './components/ui/Toast'

import Landing from './pages/Landing'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Pricing from './pages/Pricing'
import AppLayout from './components/layout/AppLayout'
import GroupLayout from './pages/group/GroupLayout'
import Chat from './pages/group/Chat'
import Tasks from './pages/group/Tasks'
import Board from './pages/group/Board'
import Files from './pages/group/Files'
import Ideas from './pages/group/Ideas'
import GroupSettings from './pages/group/Settings'

function AuthGuard({ children }) {
  const { user, loading } = useStore()
  if (loading) return null
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function GuestGuard({ children }) {
  const { user, loading } = useStore()
  if (loading) return null
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<GuestGuard><Landing /></GuestGuard>} />
        <Route path="/auth" element={<GuestGuard><Auth /></GuestGuard>} />
        <Route path="/pricing" element={<Pricing />} />

        <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/group/:groupId" element={<GroupLayout />}>
            <Route index element={<Navigate to="chat" replace />} />
            <Route path="chat" element={<Chat />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="board" element={<Board />} />
            <Route path="files" element={<Files />} />
            <Route path="ideas" element={<Ideas />} />
            <Route path="settings" element={<GroupSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const { setUser, fetchProfile, setLoading, initTheme } = useStore()
  const toasts = useToastStore(s => s.toasts)
  const removeToast = useToastStore(s => s.remove)

  useEffect(() => {
    initTheme()

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        fetchProfile(session.user.id)
      } else {
        setUser(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <AnimatedRoutes />
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 items-end">
        {toasts.map(t => (
          <Toast key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </BrowserRouter>
  )
}
