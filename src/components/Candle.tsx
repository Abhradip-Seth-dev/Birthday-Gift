import React, { useState, useCallback } from 'react'

interface CandleProps {
  x: number
  y: number
  color: string
  glowColor: string
  candleIndex: number
  lit: boolean
  onLight: () => void
  delay?: number
}

const Candle: React.FC<CandleProps> = ({ x, y, candleIndex, lit, onLight, delay = 0 }) => {
  const [showRipple, setShowRipple] = useState(false)

  const handleClick = useCallback(() => {
    if (lit) return
    setShowRipple(true)
    setTimeout(() => setShowRipple(false), 700)
    onLight()
  }, [lit, onLight])

  // Wick tip in SVG local coords (top of candle body = y=0, wick goes up 8px)
  const wickTipY = -9

  return (
    <g
      transform={`translate(${x}, ${y})`}
      onClick={handleClick}
      style={{ cursor: lit ? 'default' : 'pointer' }}
      role="button"
      aria-label={lit ? 'Candle is lit' : 'Click to light this candle'}
      tabIndex={lit ? -1 : 0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick() }}
    >
      {/* Candle body */}
      <rect
        x="-6"
        y="0"
        width="12"
        height="28"
        rx="3"
        fill={`url(#candleGrad-${candleIndex})`}
      />
      {/* Candle top cap */}
      <ellipse cx="0" cy="0" rx="6" ry="3" fill="rgba(255,255,255,0.22)" />

      {/* Wick */}
      <line
        x1="0" y1="-1"
        x2="0" y2={wickTipY}
        stroke="#555" strokeWidth="1.2" strokeLinecap="round"
      />

      {/* ── Lit state ──────────────────────────────── */}
      {lit && (
        <>
          {/* Glow halo around flame */}
          <ellipse
            cx="0"
            cy={wickTipY}
            rx="16"
            ry="16"
            fill={`url(#glow-${candleIndex})`}
          >
            <animate
              attributeName="rx" values="14;18;14"
              dur="2.2s" repeatCount="indefinite"
            />
            <animate
              attributeName="ry" values="14;18;14"
              dur="2.2s" repeatCount="indefinite"
            />
            <animate
              attributeName="opacity" values="0.9;0.6;0.9"
              dur="2.2s" repeatCount="indefinite"
            />
          </ellipse>

          {/* Outer flame — anchored at wick tip, flickers left/right */}
          <g>
            <path
              d={`M0,${wickTipY} C3,${wickTipY - 6} 5,${wickTipY - 12} 0,${wickTipY - 20} C-5,${wickTipY - 12} -3,${wickTipY - 6} 0,${wickTipY} Z`}
              fill="url(#flameGradOuter)"
              opacity="0.92"
            >
              {/* Lateral flicker — origin at base (wick tip) */}
              <animateTransform
                attributeName="transform"
                type="rotate"
                values={`-3 0 ${wickTipY}; 3 0 ${wickTipY}; -2 0 ${wickTipY}; 4 0 ${wickTipY}; -3 0 ${wickTipY}`}
                keyTimes="0; 0.25; 0.5; 0.75; 1"
                dur={`${1.3 + delay * 0.2}s`}
                repeatCount="indefinite"
              />
            </path>
            {/* Vertical breath */}
            <animateTransform
              attributeName="transform"
              type="scale"
              additive="sum"
              values={`1 1 0 ${wickTipY}; 1 1.08 0 ${wickTipY}; 1 0.95 0 ${wickTipY}; 1 1 0 ${wickTipY}`}
              keyTimes="0; 0.33; 0.66; 1"
              dur={`${1.8 + delay * 0.15}s`}
              repeatCount="indefinite"
            />
          </g>

          {/* Inner flame — brighter core */}
          <path
            d={`M0,${wickTipY} C2,${wickTipY - 4} 3,${wickTipY - 9} 0,${wickTipY - 15} C-3,${wickTipY - 9} -2,${wickTipY - 4} 0,${wickTipY} Z`}
            fill="url(#flameGradInner)"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values={`2 0 ${wickTipY}; -2 0 ${wickTipY}; 3 0 ${wickTipY}; -1 0 ${wickTipY}; 2 0 ${wickTipY}`}
              keyTimes="0; 0.25; 0.5; 0.75; 1"
              dur={`${1.1 + delay * 0.18}s`}
              repeatCount="indefinite"
            />
          </path>

          {/* Glowing core dot at wick tip */}
          <ellipse
            cx="0"
            cy={wickTipY + 1}
            rx="2"
            ry="2.5"
            fill="rgba(255,255,210,0.98)"
          >
            <animate
              attributeName="opacity" values="0.9;1;0.85;1;0.9"
              dur="1.6s" repeatCount="indefinite"
            />
          </ellipse>
        </>
      )}

      {/* Click ripple */}
      {showRipple && (
        <circle
          cx="0"
          cy={wickTipY}
          r="8"
          fill="none"
          stroke="rgba(255,210,100,0.55)"
          strokeWidth="2"
          className="candle-ripple"
        />
      )}
    </g>
  )
}

export default Candle
