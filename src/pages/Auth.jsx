import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import useStore from '../store/useStore'
import { useToast } from '../hooks/useToast'
import Button from '../components/ui/Button'
import { Input, FormField } from '../components/ui/Input'

export default function Auth() {
  const [params] = useSearchParams()
  const [tab, setTab] = useState(params.get('tab') === 'register' ? 'register' : 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setUser, fetchProfile } = useStore()
  const { success, error } = useToast()

  useEffect(() => {
    setTab(params.get('tab') === 'register' ? 'register' : 'login')
  }, [params])

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { error(err.message); setLoading(false); return }
    setUser(data.user)
    await fetchProfile(data.user.id)
    success('Bienvenido de vuelta')
    navigate('/dashboard')
  }

  async function handleRegister(e) {
    e.preventDefault()
    if (!name.trim()) { error('El nombre es obligatorio'); return }
    setLoading(true)
    const { data, error: err } = await supabase.auth.signUp({ email, password })
    if (err) { error(err.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        full_name: name.trim(),
        username: email.split('@')[0],
      })
      setUser(data.user)
      await fetchProfile(data.user.id)
      success('Cuenta creada. ¡Bienvenido!')
      navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-dark flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 bg-primary items-center justify-center p-12">
        <div>
          <span className="font-display text-3xl font-bold text-white block mb-4">GroupUp</span>
          <p className="text-white/70 text-lg max-w-xs">Colaboración en equipo, sin complicaciones.</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          className="w-full max-w-sm"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        >
          <Link to="/" className="block font-display text-xl font-bold text-primary mb-8 lg:hidden">GroupUp</Link>

          <h1 className="font-display text-2xl font-bold text-ink dark:text-white mb-1">
            {tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </h1>
          <p className="text-sm text-ink-3 dark:text-white/40 mb-8">
            {tab === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button
              className="text-primary hover:underline"
              onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
            >
              {tab === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>

          <form onSubmit={tab === 'login' ? handleLogin : handleRegister} className="flex flex-col gap-4">
            {tab === 'register' && (
              <FormField label="Nombre completo">
                <Input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ana García"
                  required
                  autoFocus
                />
              </FormField>
            )}
            <FormField label="Correo electrónico">
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                autoFocus={tab === 'login'}
              />
            </FormField>
            <FormField label="Contraseña">
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
              />
            </FormField>
            <Button type="submit" loading={loading} size="lg" className="mt-2 w-full">
              {tab === 'login' ? 'Entrar' : 'Crear cuenta'}
            </Button>
          </form>

          <p className="mt-6 text-xs text-ink-4 dark:text-white/25 text-center">
            Al continuar aceptas los Términos de servicio y la Política de privacidad.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
