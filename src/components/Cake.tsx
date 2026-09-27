import React, { useCallback, useRef, useState } from 'react'
import Candle from './Candle'

interface CakeProps {
  litCandles: boolean[]
  onCandleLight: (index: number) => void
}

const CANDLES = [
  { xRel: -88, color: '#e8749a', glow: '#e8749a' },  // rose
  { xRel: -56, color: '#c9b3f5', glow: '#c9b3f5' },  // lavender
  { xRel: -24, color: '#ffd580', glow: '#ffd580' },  // warm gold
  { xRel: 8,   color: '#f5c842', glow: '#f5c842' },  // yellow gold
  { xRel: 40,  color: '#80d4f5', glow: '#80d4f5' },  // sky blue
  { xRel: 72,  color: '#a8e6b0', glow: '#a8e6b0' },  // mint green
]

const Cake: React.FC<CakeProps> = ({ litCandles, onCandleLight }) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([])
  const particleId = useRef(0)

  // Emit small sparkle on candle light
  const handleCandleLight = useCallback((index: number) => {
    onCandleLight(index)
    // Emit sparkle particles
    const baseX = 120 + CANDLES[index].xRel + 4
    const baseY = 60
    const newParticles = Array.from({ length: 6 }, () => ({
      id: particleId.current++,
      x: baseX + (Math.random() - 0.5) * 20,
      y: baseY + (Math.random() - 0.5) * 10,
      color: CANDLES[index].color,
    }))
    setParticles(prev => [...prev, ...newParticles])
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(n => n.id === p.id)))
    }, 1400)
  }, [onCandleLight])

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg
        ref={svgRef}
        viewBox="0 0 240 220"
        width="100%"
        style={{ maxWidth: '320px', overflow: 'visible' }}
        aria-label="Birthday cake"
      >
        <defs>
          {/* Cake layers gradients */}
          <linearGradient id="layer1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6d3b7d" />
            <stop offset="100%" stopColor="#4a2558" />
          </linearGradient>
          <linearGradient id="layer2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b4d9e" />
            <stop offset="100%" stopColor="#5c2d72" />
          </linearGradient>
          <linearGradient id="layer3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a85dc0" />
            <stop offset="100%" stopColor="#7a3a95" />
          </linearGradient>
          <linearGradient id="frosting1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f9d6f3" />
            <stop offset="100%" stopColor="#e8b4e2" />
          </linearGradient>
          <linearGradient id="plateGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3a1f50" />
            <stop offset="100%" stopColor="#1e0e30" />
          </linearGradient>

          {/* Candle gradients — index-based IDs to avoid duplicates */}
          {CANDLES.map((c, i) => (
            <linearGradient key={`cg-${i}`} id={`candleGrad-${i}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={c.color} stopOpacity="0.6" />
              <stop offset="40%" stopColor={c.color} />
              <stop offset="100%" stopColor={c.color} stopOpacity="0.7" />
            </linearGradient>
          ))}

          {/* Glow gradients — index-based IDs */}
          {CANDLES.map((c, i) => (
            <radialGradient key={`gg-${i}`} id={`glow-${i}`}>
              <stop offset="0%" stopColor={c.glow} stopOpacity="0.38" />
              <stop offset="100%" stopColor={c.glow} stopOpacity="0" />
            </radialGradient>
          ))}

          {/* Flame gradients */}
          <linearGradient id="flameGradOuter" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff9500" />
            <stop offset="60%" stopColor="#ff6b00" />
            <stop offset="100%" stopColor="#ff4500" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="flameGradInner" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fffde4" />
            <stop offset="50%" stopColor="#ffe0a0" />
            <stop offset="100%" stopColor="#ffb347" />
          </linearGradient>

          {/* Drip gradient */}
          <linearGradient id="dripGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0c8eb" />
            <stop offset="100%" stopColor="#d4a0cf" />
          </linearGradient>

          {/* Drop shadow */}
          <filter id="cakeShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(0,0,0,0.5)" />
          </filter>
          <filter id="cakeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* === Plate === */}
        <ellipse cx="120" cy="210" rx="105" ry="10" fill="url(#plateGrad)" opacity="0.6" />

        {/* === Cake shadow === */}
        <ellipse cx="120" cy="205" rx="88" ry="7" fill="rgba(0,0,0,0.45)" />

        {/* ── Bottom layer (widest) ── */}
        <rect x="20" y="160" width="200" height="45" rx="6" fill="url(#layer1)" filter="url(#cakeShadow)" />
        {/* Frosting drips */}
        <path d="M30,160 Q40,148 50,160 Q60,148 70,160 Q80,148 90,160 Q100,148 110,160 Q120,148 130,160 Q140,148 150,160 Q160,148 170,160 Q180,148 190,160 Q200,148 210,160" fill="url(#dripGrad)" stroke="none" />
        <rect x="20" y="156" width="200" height="12" rx="4" fill="url(#frosting1)" />
        {/* Layer dots decoration */}
        {[45, 80, 120, 160, 195].map((dx, i) => (
          <circle key={i} cx={dx} cy="182" r="4" fill="rgba(255,255,255,0.15)" />
        ))}
        {/* Sprinkles */}
        {[[35,172,30], [60,190,60], [90,175,-20], [145,185,45], [180,170,-30], [205,192,15]].map(([sx, sy, rot], i) => (
          <rect key={i} x={sx} y={sy} width="8" height="3" rx="1.5"
            fill={['#f5c842','#e8749a','#80d4f5','#c9b3f5'][i % 4]}
            transform={`rotate(${rot}, ${sx+4}, ${sy+1.5})`}
            opacity="0.8"
          />
        ))}

        {/* ── Middle layer ── */}
        <rect x="38" y="115" width="164" height="50" rx="6" fill="url(#layer2)" />
        <path d="M48,115 Q57,104 66,115 Q75,104 84,115 Q93,104 102,115 Q111,104 120,115 Q129,104 138,115 Q147,104 156,115 Q165,104 174,115 Q183,104 192,115" fill="url(#dripGrad)" />
        <rect x="38" y="111" width="164" height="11" rx="4" fill="url(#frosting1)" />
        {/* Decorative heart */}
        <text x="120" y="145" textAnchor="middle" fontSize="18" fill="rgba(255,255,255,0.2)">♥</text>
        {/* Sprinkles */}
        {[[50,130,15], [95,138,-25], [140,128,40], [178,137,-10]].map(([sx, sy, rot], i) => (
          <rect key={i} x={sx} y={sy} width="7" height="2.5" rx="1.2"
            fill={['#ffd580','#e8749a','#c9b3f5','#f5c842'][i % 4]}
            transform={`rotate(${rot}, ${sx+3.5}, ${sy+1.25})`}
            opacity="0.75"
          />
        ))}

        {/* ── Top layer (narrowest) ── */}
        <rect x="58" y="75" width="124" height="45" rx="6" fill="url(#layer3)" />
        <path d="M66,75 Q74,65 82,75 Q90,65 98,75 Q106,65 114,75 Q122,65 130,75 Q138,65 146,75 Q154,65 162,75 Q170,65 178,75" fill="url(#dripGrad)" />
        <rect x="58" y="71" width="124" height="11" rx="4" fill="url(#frosting1)" />
        {/* Star sparkles */}
        {[[75,92], [120,96], [165,90]].map(([sx,sy],i) => (
          <text key={i} x={sx} y={sy} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.25)">✦</text>
        ))}

        {/* === Candles === */}
        {CANDLES.map((c, i) => (
          <Candle
            key={i}
            x={120 + c.xRel + 4}
            y={71}
            color={c.color}
            glowColor={c.glow}
            candleIndex={i}
            lit={litCandles[i]}
            onLight={() => handleCandleLight(i)}
            delay={i * 0.15}
          />
        ))}
      </svg>

      {/* SVG particle sparkles overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map(p => (
          <div
            key={p.id}
            className="sparkle absolute"
            style={{
              left: `calc(50% + ${p.x - 120}px)`,
              top: `${p.y}px`,
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: p.color,
              boxShadow: `0 0 6px ${p.color}`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default Cake
