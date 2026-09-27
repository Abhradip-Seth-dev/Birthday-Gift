import React, { useState, useCallback, useEffect } from 'react'
import BirthdayIntro from './components/BirthdayIntro'
import NightSky from './components/NightSky'

type Scene = 'intro' | 'sky'

function App() {
  const [currentScene, setCurrentScene] = useState<Scene>('intro')
  const [transitioning, setTransitioning] = useState(false)
  const [skyMounted, setSkyMounted] = useState(false)

  const handleContinue = useCallback(() => {
    if (transitioning) return
    setTransitioning(true)
    setSkyMounted(true)

    // Mount sky, then after a brief moment switch scenes
    setTimeout(() => {
      setCurrentScene('sky')
      setTimeout(() => setTransitioning(false), 1400)
    }, 100)
  }, [transitioning])

  // Preload sky scene fonts/resources
  useEffect(() => {
    // Nothing specific needed; fonts are loaded via CSS
  }, [])

  return (
    <div className="page-wrapper" role="main">
      {/* Scene 1: Birthday Intro */}
      <BirthdayIntro
        onContinue={handleContinue}
        visible={currentScene === 'intro'}
      />

      {/* Scene 2: Night Sky — only mounted when needed */}
      {skyMounted && (
        <NightSky visible={currentScene === 'sky'} />
      )}
    </div>
  )
}

export default App
