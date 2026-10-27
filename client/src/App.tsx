import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import RecordForm from './pages/RecordForm'
import './index.css'

function App() {
  const [currentScreen, setCurrentScreen] = useState('overview')
  const [screenParams, setScreenParams] = useState({})

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