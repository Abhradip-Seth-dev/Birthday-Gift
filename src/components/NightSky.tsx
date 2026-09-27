import React, { useEffect, useState } from 'react'
import StarField from './StarField'
import BirthdayMessage from './BirthdayMessage'

interface NightSkyProps {
  scene: 'intro' | 'sky' | 'message'
  onWishMade: () => void
}

const NightSky: React.FC<NightSkyProps> = ({ scene, onWishMade }) => {
  const [starsVisible, setStarsVisible] = useState(false)

  const isVisible = scene === 'sky' || scene === 'message'

  useEffect(() => {
    if (scene === 'sky') {
      const t1 = setTimeout(() => setStarsVisible(true), 150)
      return () => clearTimeout(t1)
    }
  }, [scene])

  return (
    <div
      className={`scene scene-sky ${isVisible ? 'scene-visible' : 'scene-enter'}`}
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #0f0d24 0%, #0a0812 55%, #06040e 100%)',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      {/* ── Star field — always positioned absolutely so it fills the scene ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          opacity: starsVisible ? 1 : 0,
          transition: 'opacity 2s ease',
          pointerEvents: 'none',
        }}
      >
        <StarField />
      </div>

      {/* ── Horizon vignette ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30vh',
          zIndex: 2,
          background: 'linear-gradient(to top, rgba(10, 8, 18, 0.75) 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Subtle moon glow ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '6%',
          right: '10%',
          width: '80px',
          height: '80px',
          zIndex: 2,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,230,0.18) 0%, rgba(255,255,200,0.07) 40%, transparent 70%)',
          filter: 'blur(12px)',
          opacity: starsVisible ? 1 : 0,
          transition: 'opacity 3s ease 1s',
          pointerEvents: 'none',
        }}
      />

      {/* ── Scene 2: Wish Button ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          opacity: scene === 'sky' && starsVisible ? 1 : 0,
          transition: 'opacity 1s ease 1s',
          pointerEvents: scene === 'sky' ? 'auto' : 'none',
        }}
      >
        <button
          onClick={onWishMade}
          style={{
            padding: '1rem 3.5rem',
            fontSize: '1.4rem',
            fontFamily: 'var(--font-elegant)',
            fontStyle: 'italic',
            color: '#fffde4',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '999px',
            backdropFilter: 'blur(8px)',
            cursor: 'pointer',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.4s ease',
            letterSpacing: '0.05em',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.25)'
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'
            e.currentTarget.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.2)'
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          Make a wish... ✨
        </button>
      </div>

      {/* ── Scene 3: Birthday message — scrollable, sits above stars ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          opacity: scene === 'message' ? 1 : 0,
          transition: 'opacity 1.4s ease',
          background: 'transparent',
          pointerEvents: scene === 'message' ? 'auto' : 'none',
        }}
      >
        {scene === 'message' && <BirthdayMessage />}
      </div>
    </div>
  )
}

export default NightSky
