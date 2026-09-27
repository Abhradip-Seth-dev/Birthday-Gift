import React, { useEffect, useRef, useState } from 'react'

interface Confetti {
  id: number
  x: number
  color: string
  size: number
  duration: number
  delay: number
  rotation: number
  isCircle: boolean
}

interface ConfettiBurstProps {
  active: boolean
}

const COLORS = [
  '#f5c842', '#ffd580', '#e8749a', '#c9b3f5',
  '#80d4f5', '#f0c8eb', '#ffffff', '#ffb347',
]

const ConfettiBurst: React.FC<ConfettiBurstProps> = ({ active }) => {
  const [pieces, setPieces] = useState<Confetti[]>([])
  const idRef = useRef(0)
  const hasBurstedRef = useRef(false)

  useEffect(() => {
    if (!active || hasBurstedRef.current) return
    hasBurstedRef.current = true

    // Create confetti burst
    const newPieces: Confetti[] = Array.from({ length: 60 }, () => ({
      id: idRef.current++,
      x: 10 + Math.random() * 80, // % from left
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 4 + Math.random() * 6,
      duration: 3 + Math.random() * 2.5,
      delay: Math.random() * 1.5,
      rotation: Math.random() * 360,
      isCircle: Math.random() > 0.6,
    }))

    setPieces(newPieces)

    // Clean up after all animations finish
    setTimeout(() => {
      setPieces([])
      hasBurstedRef.current = false
    }, 6000)
  }, [active])

  if (!active && pieces.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece absolute"
          style={{
            left: `${p.x}%`,
            top: '-10px',
            width: p.isCircle ? `${p.size}px` : `${p.size * 1.2}px`,
            height: p.isCircle ? `${p.size}px` : `${p.size * 0.5}px`,
            background: p.color,
            borderRadius: p.isCircle ? '50%' : '2px',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
            opacity: 0,
            boxShadow: `0 0 4px ${p.color}40`,
          }}
        />
      ))}
    </div>
  )
}

export default ConfettiBurst
