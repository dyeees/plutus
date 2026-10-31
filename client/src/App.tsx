import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import RecordForm from './pages/RecordForm'
import AuthPage from './pages/AuthPage'
import './index.css'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { signup } from './services/auth'

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [currentScreen, setCurrentScreen] = useState('overview')
  const [screenParams, setScreenParams] = useState({})

  const [isSignUp, setIsSignUp] = useState(false)
  const [form, setForm] = useState({
    name: '', 
    email: '', 
    password: '', 
    confirm: '',
  })

  const [busy, setBusy] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setServerError(null)

    if (isSignUp && form.password !== form.confirm) {
      setServerError('Passwords do not match.')
      return
    }

    setBusy(true)

    try {
      await signup({
        name: form.name,
        email: form.email,
        password: form.password,
      })

      alert('Account created successfully! You can now sign in.')

      setIsSignUp(false)
      setForm({
        name: '',
        email: form.email,
        password: '',
        confirm: '',
      })
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : 'Unable to create account.',
      )
    } finally {
      setBusy(false)
    }
  }

  function handleFieldChange(field: string, value: string) {
    setForm(previous => ({
      ...previous,
      [field]: value,
    }))
  }

  if (!authenticated) {
    return (
      <AuthPage
        isSignUp={isSignUp}
        onSubmit={handleAuthSubmit}
        form={form}
        onFieldChange={handleFieldChange}
        serverError={serverError}
        busy={busy}
        onSwitchMode={mode => {
          setIsSignUp(mode === 'signup')
          setServerError(null)
        }}
      />
    )
  }

  const activeTab = ['add-record', 'edit-record', 'record-detail'].includes(currentScreen)
    ? 'finances'
    : currentScreen

  function navigate(screen: string, params = {}) {
    setCurrentScreen(screen)
    setScreenParams(params)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans selection:bg-[#C8860A]/20 selection:text-[#1E2D26]">
      <Sidebar
        activeTab={activeTab}
        navigate={navigate}
      />

      {/* ──── Main Content ────*/}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Navbar
          currentScreen={currentScreen}
          activeTab={activeTab}
          navigate={navigate}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto pb-24 md:pb-12">
          <RecordForm />
        </main>
      </div>
    </div>
  )
}

export default App