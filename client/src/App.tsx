import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import RecordForm from './pages/RecordForm'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import './index.css'

import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { signup, login, getCurrentUser, logout } from './services/auth'

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [user, setUser] = useState<{name: string, email: string} | null>(null)
  useEffect(() => {
    async function checkSession() {
      try {
        const currentUser = await getCurrentUser()

        if (currentUser) {
          setUser({
            name: currentUser.name,
            email: currentUser.email,
          })
          setAuthenticated(true)
        }
      } catch (error) {
        console.error('Session check failed:', error)
      } finally {
        setIsCheckingSession(false)
      }
    }

    checkSession()
  }, [])

  useEffect(() => {
    function handlePopState(event: PopStateEvent) {
      const screen = event.state?.screen || 'dashboard'
      const params = event.state?.params || {}
      setCurrentScreen(screen)
      setScreenParams(params)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  const [currentScreen, setCurrentScreen] = useState(() => {
    return window.history.state?.screen || 'dashboard'
  })
    useEffect(() => {
    window.history.replaceState(
      { screen: currentScreen },
      '',
      window.location.pathname
    )
  }, [])

  const [screenParams, setScreenParams] = useState<{ returnTo?: string }>({})

  const [isSignUp, setIsSignUp] = useState(false)
  const [form, setForm] = useState({
    name: '', 
    email: '', 
    password: '', 
    confirm: '',
  })

  const [busy, setBusy] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
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
      if (isSignUp) {
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
      } else {
        const result = await login({
          email: form.email,
          password: form.password,
        })

        setUser({
          name: result.user.name,
          email: result.user.email,
        })
        
        setCurrentScreen('dashboard')
        window.history.replaceState(
          { screen: 'dashboard' },
          '', window.location.pathname
        )
        setAuthenticated(true)
      }
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : 'Authentication failed.'
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

  const signOut = async () => {
    setIsLoggingOut(true)
    try {
      await logout()
      setAuthenticated(false)
      setUser(null)
      setCurrentScreen('overview')
      setForm({name: '', email: '', password: '', confirm: '',})
      setIsSignUp(false)
      setServerError(null)
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (isCheckingSession) {
    return <div className="min-h-screen flex items-center justify-center">
      Loading Plutus...
    </div>
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

  const activeTab = ['edit-record', 'record-detail'].includes(currentScreen)
    ? 'finances'
    : currentScreen

  function navigate(screen: string, params: { returnTo?: string } = {}) {
    if (screen === 'add-record') {
      setScreenParams({
        returnTo: currentScreen === 'add-record'
          ? screenParams.returnTo
          : currentScreen,
      })
    } else {
      setScreenParams(params)
    }

    window.history.pushState(
      { screen, params },
      '',
      window.location.pathname
    )
    setCurrentScreen(screen)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans selection:bg-[#C8860A]/20 selection:text-[#1E2D26]">
      <Sidebar
        activeTab={activeTab}
        navigate={navigate}
        user={user}
        signOut={signOut}
        isLoggingOut={isLoggingOut}
      />

      {/* ──── Main Content ────*/}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <Navbar
          currentScreen={currentScreen}
          activeTab={activeTab}
          navigate={navigate}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl w-full mx-auto pb-24 md:pb-12">
          {currentScreen === 'dashboard' && <Dashboard navigate={navigate} />}
          {currentScreen === 'add-record' && (<RecordForm onCancel={() => navigate(screenParams.returnTo || 'dashboard')}/>)}
        </main>
      </div>
    </div>
  )
}

export default App