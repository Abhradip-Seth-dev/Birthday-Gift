import React, { useEffect, useRef, useState } from 'react'

interface MessageParagraph {
  text: string
  isFinal?: boolean
  isTitle?: boolean
}

const MESSAGE_PARAGRAPHS: MessageParagraph[] = [
  { text: "Happy Birthday dr 🥳", isTitle: true },
  { text: "many many happy returns of the Day 🎂🎂" },
  { text: "Ki boli, we are friends since 2024 — ludo khelte khelte alap, tarpor valo bondhu hoye otha. It was a long journey 😇" },
  { text: "Asha kori ei 20'r jibon anonde, sukhe, nijer moto kore katan 🙏" },
  { text: "Ar thank you amar koto public ke anonde rakhar jonno 🙏🥲\nkhoj neuar jonno 🙏\nsob onushthan-e nimonton korar jonno 🙏☄️" },
  { text: "Amar spark firiye dewar jonno, bishwas korar jonno 😇☄️" },
  { text: "Apnar sob shopno puron hok.\nAr ei bhabei kete jak baki jibon 🙏🎂🎂" },
  { text: "I want to travel the whole world with you ☄️☄️☄️🙂↕️🙂↕️🙂↕️", isFinal: true },
]

// Staggered reveal delays per paragraph (ms)
const REVEAL_DELAYS = [200, 900, 1700, 2500, 3300, 4100, 4900, 6000]

const BirthdayMessage: React.FC = () => {
  const [revealed, setRevealed] = useState<boolean[]>(Array(MESSAGE_PARAGRAPHS.length).fill(false))
  const containerRef = useRef<HTMLDivElement>(null)

  // Timer-based sequential reveal — reliable regardless of scroll position
  useEffect(() => {
    const timers = REVEAL_DELAYS.map((delay, i) =>
      setTimeout(() => {
        setRevealed(prev => {
          const next = [...prev]
          next[i] = true
          return next
        })
      }, delay)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: 'clamp(3rem, 8vh, 5rem) 1.5rem clamp(3rem, 6vh, 4rem)',
        scrollBehavior: 'smooth',
        // Translucent so stars bleed through behind text
        background: 'transparent',
      }}
    >
      {/* ── Decorative header ornament ── */}
      <div
        style={{
          marginBottom: '2rem',
          textAlign: 'center',
          opacity: revealed[0] ? 1 : 0,
          transform: revealed[0] ? 'translateY(0)' : 'translateY(-14px)',
          transition: 'opacity 1s ease, transform 1s ease',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-elegant)',
            fontStyle: 'italic',
            fontSize: 'clamp(0.75rem, 1.8vw, 0.9rem)',
            color: 'rgba(200, 170, 230, 0.6)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: '0.8rem',
          }}
        >
          — a birthday letter —
        </p>
        <div
          style={{
            width: '80px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(245,200,66,0.55), transparent)',
            margin: '0 auto',
          }}
        />
      </div>

      {/* ── Message paragraphs ── */}
      {MESSAGE_PARAGRAPHS.map((para, i) => (
        <div
          key={i}
          style={{
            maxWidth: '580px',
            width: '100%',
            textAlign: 'center',
            marginBottom: para.isFinal ? '3rem' : '2rem',
            opacity: revealed[i] ? 1 : 0,
            transform: revealed[i] ? 'translateY(0)' : 'translateY(22px)',
            transition: 'opacity 1.1s cubic-bezier(0.4, 0, 0.2, 1), transform 1.1s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {para.isTitle ? (
            // ── BIG TITLE ──
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                color: '#ffd580',
                lineHeight: 1.2,
                textShadow:
                  '0 0 30px rgba(255, 213, 128, 0.5), 0 0 60px rgba(255, 200, 80, 0.25)',
                marginBottom: '0.2rem',
              }}
            >
              {para.text}
            </h2>
          ) : para.isFinal ? (
            // ── FINAL EMOTIONAL LINE ──
            <div style={{ position: 'relative', marginTop: '1rem' }}>
              {/* Gold line above */}
              <div
                style={{
                  width: '100px',
                  height: '1px',
                  background:
                    'linear-gradient(90deg, transparent, rgba(245,200,66,0.6), transparent)',
                  margin: '0 auto 1.8rem',
                }}
              />
              <p
                style={{
                  fontFamily: 'var(--font-signature)',
                  fontSize: 'clamp(1.7rem, 4.5vw, 2.8rem)',
                  color: '#ffd580',
                  fontWeight: 400,
                  lineHeight: 1.55,
                  textShadow:
                    '0 0 40px rgba(255, 213, 128, 0.55), 0 0 80px rgba(245, 200, 66, 0.25)',
                  whiteSpace: 'pre-line',
                }}
              >
                {para.text}
              </p>
              {/* Ambient glow behind final line */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  inset: '-30px -40px',
                  background:
                    'radial-gradient(ellipse, rgba(245,200,66,0.07) 0%, transparent 68%)',
                  pointerEvents: 'none',
                  zIndex: -1,
                }}
              />
            </div>
          ) : (
            // ── BODY PARAGRAPH ──
            <p
              style={{
                fontFamily: 'var(--font-elegant)',
                fontSize: 'clamp(1.05rem, 2.5vw, 1.25rem)',
                lineHeight: 2,
                color: 'rgba(235, 225, 245, 0.88)',
                fontWeight: 400,
                fontStyle: 'italic',
                whiteSpace: 'pre-line',
                letterSpacing: '0.01em',
              }}
            >
              {para.text}
            </p>
          )}
        </div>
      ))}

      {/* ── End ornament ── */}
      <div
        style={{
          opacity: revealed[MESSAGE_PARAGRAPHS.length - 1] ? 1 : 0,
          transition: 'opacity 1.5s ease 0.8s',
          textAlign: 'center',
          marginTop: '0.5rem',
          color: 'rgba(245,200,66,0.45)',
          fontSize: '1rem',
          letterSpacing: '0.8rem',
        }}
      >
        ✦ ✦ ✦
      </div>
    </div>
  )
}

export default BirthdayMessage
