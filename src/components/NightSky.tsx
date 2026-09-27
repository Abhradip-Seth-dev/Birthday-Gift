import React, { useEffect, useState } from 'react'
import StarField from './StarField'
import BirthdayMessage from './BirthdayMessage'

interface NightSkyProps {
  visible: boolean
}

const NightSky: React.FC<NightSkyProps> = ({ visible }) => {
  const [starsVisible, setStarsVisible] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    if (!visible) return
    const t1 = setTimeout(() => setStarsVisible(true), 150)
    const t2 = setTimeout(() => setContentVisible(true), 800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [visible])

  return (
    <div
      className={`scene scene-sky ${visible ? 'scene-visible' : 'scene-enter'}`}
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #0f0d24 0%, #0a0812 55%, #06040e 100%)',
        pointerEvents: visible ? 'auto' : 'none',
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

      {/* ── Birthday message — scrollable, sits above stars ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          opacity: contentVisible ? 1 : 0,
          transition: 'opacity 1.4s ease',
          // transparent so stars show through
          background: 'transparent',
        }}
      >
        <BirthdayMessage />
      </div>
    </div>
  )
}

export default NightSky
