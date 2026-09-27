import React, { useEffect, useRef, useState, useCallback } from 'react'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
}

interface ShootingStar {
  id: number
  startX: number   // vw %
  startY: number   // vh %
  angle: number    // CSS rotate degrees
  length: number   // px
  duration: number // s
}

const StarField: React.FC = () => {
  const [stars] = useState<Star[]>(() => {
    const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 160 : 260
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      // Mix of tiny dots and a few larger accent stars
      size:
        i < 8
          ? Math.random() * 2.5 + 2.5    // bright accent (8 stars)
          : Math.random() < 0.2
          ? Math.random() * 1.5 + 1.2    // medium
          : Math.random() * 0.9 + 0.4,   // tiny
      opacity: Math.random() * 0.45 + 0.45,
      duration: Math.random() * 4 + 2,
      delay: Math.random() * 6,
    }))
  })

  const [shootingStars, setShootingStars] = useState<ShootingStar[]>([])
  const idRef = useRef(0)

  const spawnShootingStar = useCallback(() => {
    const id = idRef.current++
    const startX = 30 + Math.random() * 60   // 30–90 % from left
    const startY = 2  + Math.random() * 38   // top 40%
    const angle  = 145 + Math.random() * 25  // ~145–170° (right-to-left diag)
    const length = 140 + Math.random() * 200
    const duration = 1.0 + Math.random() * 0.7

    const star: ShootingStar = { id, startX, startY, angle, length, duration }
    setShootingStars(prev => [...prev, star])

    // Remove after animation completes
    setTimeout(() => {
      setShootingStars(prev => prev.filter(s => s.id !== id))
    }, (duration + 0.4) * 1000)
  }, [])

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [
      setTimeout(() => spawnShootingStar(), 1200),
      setTimeout(() => spawnShootingStar(), 4000),
      setTimeout(() => spawnShootingStar(), 7800),
      setTimeout(() => spawnShootingStar(), 11500),
    ]
    const interval = setInterval(() => {
      if (Math.random() > 0.25) spawnShootingStar()
    }, 4200)
    return () => {
      timeouts.forEach(clearTimeout)
      clearInterval(interval)
    }
  }, [spawnShootingStar])

  return (
    <div
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      {/* ── Static twinkling stars ── */}
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            position: 'absolute',
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            borderRadius: '50%',
            background: star.size > 2
              ? 'rgba(255, 248, 230, 0.95)'
              : 'rgba(220, 215, 255, 0.9)',
            '--star-opacity': star.opacity,
            '--twinkle-duration': `${star.duration}s`,
            '--twinkle-delay': `${star.delay}s`,
            boxShadow: star.size > 2.5
              ? `0 0 ${star.size * 3}px rgba(255,248,220,0.7), 0 0 ${star.size * 6}px rgba(200,180,255,0.3)`
              : star.size > 1.2
              ? `0 0 ${star.size * 2}px rgba(255,255,255,0.4)`
              : 'none',
          } as React.CSSProperties}
        />
      ))}

      {/* ── Shooting stars — self-contained keyframe animation ── */}
      {shootingStars.map(s => (
        <ShootingStarEl key={s.id} {...s} />
      ))}

      {/* ── Nebula wisps ── */}
      <div style={{
        position: 'absolute', width: '45vw', height: '35vh',
        top: '3%', left: '55%',
        background: 'radial-gradient(ellipse, rgba(90,55,200,0.09) 0%, transparent 70%)',
        filter: 'blur(30px)',
      }} />
      <div style={{
        position: 'absolute', width: '38vw', height: '28vh',
        top: '25%', left: '-5%',
        background: 'radial-gradient(ellipse, rgba(50,70,180,0.07) 0%, transparent 70%)',
        filter: 'blur(28px)',
      }} />
      <div style={{
        position: 'absolute', width: '25vw', height: '20vh',
        top: '55%', right: '5%',
        background: 'radial-gradient(ellipse, rgba(160,80,200,0.06) 0%, transparent 70%)',
        filter: 'blur(25px)',
      }} />
    </div>
  )
}

// ─── Individual shooting star ───
const ShootingStarEl: React.FC<ShootingStar> = ({ startX, startY, angle, length, duration }) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${startX}%`,
        top: `${startY}%`,
        width: `${length}px`,
        height: '2px',
        transformOrigin: 'left center',
        transform: `rotate(${angle}deg)`,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          animation: `shootTranslate ${duration}s cubic-bezier(0.2, 0.6, 0.8, 1) forwards`,
          background:
            'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 40%, rgba(255,255,255,1) 60%, rgba(255,255,255,0) 100%)',
          borderRadius: '999px',
          boxShadow: '0 0 4px rgba(255,255,255,0.7), 0 0 8px rgba(200,180,255,0.4)',
          filter: 'blur(0.3px)',
        }}
      />
    </div>
  )
}

export default StarField
