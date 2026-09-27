import React, { useCallback, useEffect, useRef, useState } from 'react'
import Cake from './Cake'
import ConfettiBurst from './ConfettiBurst'

interface BirthdayIntroProps {
  onContinue: () => void
  visible: boolean
}

const TOTAL_CANDLES = 6

const BirthdayIntro: React.FC<BirthdayIntroProps> = ({ onContinue, visible }) => {
  const [litCandles, setLitCandles] = useState<boolean[]>(Array(TOTAL_CANDLES).fill(false))
  const [allLit, setAllLit] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [confettiActive, setConfettiActive] = useState(false)
  const [headerVisible, setHeaderVisible] = useState(false)
  const confettiFiredRef = useRef(false)

  // Animate header in on mount
  useEffect(() => {
    if (!visible) return
    const t = setTimeout(() => setHeaderVisible(true), 400)
    return () => clearTimeout(t)
  }, [visible])

  const handleCandleLight = useCallback((index: number) => {
    setLitCandles(prev => {
      const next = [...prev]
      next[index] = true
      const newAllLit = next.every(Boolean)
      if (newAllLit) {
        setAllLit(true)
      }
      return next
    })
  }, [])

  useEffect(() => {
    if (!allLit || confettiFiredRef.current) return
    confettiFiredRef.current = true
    setConfettiActive(true)
    // Show wish button after a delay
    const t = setTimeout(() => setShowButton(true), 1200)
    return () => clearTimeout(t)
  }, [allLit])

  // Ambient floating particles
  const ambientParticles = useRef(
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      color: ['#f5c842', '#e8749a', '#c9b3f5', '#ffd580'][i % 4],
      duration: 6 + Math.random() * 8,
      delay: Math.random() * 5,
    }))
  ).current

  return (
    <div
      className={`scene scene-cake ${visible ? 'scene-visible' : 'scene-exit'}`}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Ambient background orbs */}
      <div className="ambient-orb" style={{
        width: '50vw', height: '50vw', maxWidth: '400px', maxHeight: '400px',
        top: '10%', left: '-10%',
        background: 'radial-gradient(circle, rgba(100,40,140,0.25) 0%, transparent 70%)',
        animationDelay: '0s',
      }} />
      <div className="ambient-orb" style={{
        width: '40vw', height: '40vw', maxWidth: '350px', maxHeight: '350px',
        bottom: '5%', right: '-5%',
        background: 'radial-gradient(circle, rgba(180,80,120,0.15) 0%, transparent 70%)',
        animationDelay: '-6s',
      }} />
      <div className="ambient-orb" style={{
        width: '30vw', height: '30vw', maxWidth: '280px', maxHeight: '280px',
        top: '40%', right: '10%',
        background: 'radial-gradient(circle, rgba(80,60,200,0.12) 0%, transparent 70%)',
        animationDelay: '-3s',
      }} />

      {/* Floating micro-particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {ambientParticles.map(p => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              background: p.color,
              opacity: 0.3,
              animation: `float-orb ${p.duration}s ease-in-out infinite`,
              animationDelay: `${-p.delay}s`,
              filter: 'blur(0.5px)',
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div
        className="text-center mb-6 px-4"
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 1s ease, transform 1s ease',
          zIndex: 10,
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(1rem, 3vw, 1.4rem)',
            color: 'rgba(200, 180, 230, 0.75)',
            letterSpacing: '0.1em',
            marginBottom: '0.3rem',
          }}
        >
          wishing you the most magical
        </p>
        <h1 className="heading-main" style={{
          background: 'linear-gradient(135deg, #fef9e8 0%, #ffd580 50%, #f5c842 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Happy Birthday to You,
        </h1>
        <h1 className="heading-main" style={{
          fontStyle: 'italic',
          background: 'linear-gradient(135deg, #f9b8c4 0%, #e8749a 50%, #c9b3f5 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginTop: '-0.1rem',
        }}>
          Sneha 🎂
        </h1>

        {/* Hint text */}
        {!allLit && (
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.75rem, 2vw, 0.9rem)',
              color: 'rgba(200, 180, 220, 0.55)',
              marginTop: '0.6rem',
              letterSpacing: '0.05em',
              animation: 'none',
            }}
          >
            {litCandles.filter(Boolean).length === 0
              ? '✦ tap the candles to light them ✦'
              : litCandles.filter(Boolean).length === TOTAL_CANDLES - 1
              ? '✦ one more! ✦'
              : `✦ ${litCandles.filter(Boolean).length} of ${TOTAL_CANDLES} candles lit ✦`}
          </p>
        )}
      </div>

      {/* Cake */}
      <div
        style={{
          opacity: headerVisible ? 1 : 0,
          transform: headerVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'opacity 1.2s ease 0.3s, transform 1.2s ease 0.3s',
          zIndex: 10,
          width: '100%',
          maxWidth: '380px',
          padding: '0 1.5rem',
        }}
      >
        <Cake litCandles={litCandles} onCandleLight={handleCandleLight} />
      </div>

      {/* All lit celebration text */}
      {allLit && (
        <div
          style={{
            opacity: 1,
            animation: 'fadeInUp 0.8s ease forwards',
            marginTop: '0.5rem',
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <p style={{
            fontFamily: 'var(--font-script)',
            fontSize: 'clamp(1rem, 3vw, 1.3rem)',
            color: 'var(--color-gold-warm)',
            textShadow: '0 0 20px rgba(245,200,66,0.4)',
          }}>
            Make a wish... ✨
          </p>
        </div>
      )}

      {/* Make a Wish button */}
      {showButton && (
        <div
          style={{
            marginTop: '1.5rem',
            opacity: showButton ? 1 : 0,
            transform: showButton ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.95)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            zIndex: 10,
          }}
        >
          <button
            className="btn-wish"
            onClick={onContinue}
            aria-label="Continue to the night sky"
          >
            <span style={{ position: 'relative', zIndex: 1 }}>Continue to Your Night ✨</span>
          </button>
        </div>
      )}

      {/* Confetti burst */}
      <ConfettiBurst active={confettiActive} />
    </div>
  )
}

export default BirthdayIntro
