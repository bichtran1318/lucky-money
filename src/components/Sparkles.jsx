import { useMemo } from 'react'
import './Sparkles.css'

function Sparkles() {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 3 + Math.random() * 5,
      size: 2 + Math.random() * 5,
      opacity: 0.3 + Math.random() * 0.5,
      drift: -30 + Math.random() * 60,
    }))
  }, [])

  const lanterns = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: 5 + Math.random() * 90,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      size: 20 + Math.random() * 15,
    }))
  }, [])

  return (
    <div className="sparkles-container">
      {particles.map(p => (
        <div
          key={p.id}
          className="sparkle"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            '--drift': `${p.drift}px`,
          }}
        />
      ))}
      {lanterns.map(l => (
        <div
          key={`lantern-${l.id}`}
          className="floating-lantern"
          style={{
            left: `${l.left}%`,
            animationDelay: `${l.delay}s`,
            animationDuration: `${l.duration}s`,
            fontSize: `${l.size}px`,
          }}
        >
          🏮
        </div>
      ))}
    </div>
  )
}

export default Sparkles
