import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import specialImg from '../assets/IMG_7874.JPG'
import './ResultPopup.css'

function playConfettiSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()

  // Pop burst
  const pop = ctx.createOscillator()
  const popGain = ctx.createGain()
  pop.type = 'sine'
  pop.frequency.setValueAtTime(800, ctx.currentTime)
  pop.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.05)
  pop.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15)
  popGain.gain.setValueAtTime(0.3, ctx.currentTime)
  popGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
  pop.connect(popGain).connect(ctx.destination)
  pop.start(ctx.currentTime)
  pop.stop(ctx.currentTime + 0.2)

  // Sparkle chimes
  const notes = [1200, 1500, 1800, 2200, 2600]
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.15, ctx.currentTime + 0.05 + i * 0.08)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3 + i * 0.08)
    osc.connect(gain).connect(ctx.destination)
    osc.start(ctx.currentTime + 0.05 + i * 0.08)
    osc.stop(ctx.currentTime + 0.35 + i * 0.08)
  })

  // Noise burst for texture
  const bufferSize = ctx.sampleRate * 0.1
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3
  }
  const noise = ctx.createBufferSource()
  const noiseGain = ctx.createGain()
  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type = 'highpass'
  noiseFilter.frequency.value = 3000
  noise.buffer = buffer
  noiseGain.gain.setValueAtTime(0.12, ctx.currentTime)
  noiseGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
  noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination)
  noise.start(ctx.currentTime)

  setTimeout(() => ctx.close(), 2000)
}

function ResultPopup({ layoutId, card, symbol, name, formatVND, onClose }) {
  const isSpecial = !!card.label
  const [flipped, setFlipped] = useState(false)
  const [showContent, setShowContent] = useState(false)

  // Confetti particles - burst from center
  const confetti = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => {
      const angle = (Math.PI * 2 * i) / 50 + (Math.random() - 0.5) * 0.5
      const distance = 200 + Math.random() * 400
      return {
        id: i,
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance - 100,
        delay: Math.random() * 0.3,
        duration: 1 + Math.random() * 1.5,
        size: 6 + Math.random() * 8,
        color: ['#ffd700', '#ff6b6b', '#ff9500', '#fff176', '#ff4081', '#ffc107', '#e040fb', '#00e676'][i % 8],
        rotation: Math.random() * 720,
      }
    })
  }, [])

  useEffect(() => {
    // Longer delay before flip to let hero transition finish
    const flipTimer = setTimeout(() => {
      setFlipped(true)
      playConfettiSound()
    }, 1200)
    const contentTimer = setTimeout(() => setShowContent(true), 2200)
    return () => {
      clearTimeout(flipTimer)
      clearTimeout(contentTimer)
    }
  }, [])

  return (
    <motion.div
      className="popup-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Confetti - burst from center */}
      {flipped &&
        confetti.map((c) => (
          <motion.div
            key={c.id}
            className="confetti-piece"
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{
              x: c.tx,
              y: c.ty,
              scale: [0, 1.5, 1],
              opacity: [1, 1, 0],
              rotate: c.rotation,
            }}
            transition={{
              duration: c.duration,
              delay: c.delay,
              ease: "easeOut",
            }}
            style={{
              width: `${c.size}px`,
              height: `${c.size * 1.5}px`,
              backgroundColor: c.color,
            }}
          />
        ))}

      <div className="popup-content">
        {/* The flipping card with hero transition */}
        <div className="popup-card-wrapper">
          <div className={`popup-card ${flipped ? "flipped" : ""}`}>
            {/* Back - hero from grid card */}
            <motion.div
              className="popup-card-face popup-card-back"
              layoutId={layoutId}
            >
              <div className="popup-back-inner">
                <div className="popup-back-pattern">
                  <div className="popup-back-symbol">🧧</div>
                  <div className="popup-back-question">?</div>
                </div>
              </div>
            </motion.div>

            {/* Front */}
            <div
              className={`popup-card-face popup-card-front ${isSpecial ? "popup-front-special" : ""}`}
            >
              {isSpecial ? (
                <>
                  <img
                    src={specialImg}
                    alt="Special"
                    className="popup-front-image"
                  />
                  <div className="popup-front-image-overlay-top">
                    <p className="popup-overlay-text">Thanh Tùng</p>
                  </div>
                  <div className="popup-front-image-overlay-bottom">
                    <p className="popup-overlay-text">
                      {formatVND(card.value)}
                    </p>
                  </div>
                </>
              ) : (
                <div className="popup-front-inner">
                  <div className="popup-symbol">{symbol}</div>
                  <p className="popup-name">{name}</p>
                  <div className="popup-divider"></div>
                  <p className="popup-value">{formatVND(card.value)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Congratulations text */}
        {showContent && (
          <motion.div
            className="popup-congrats"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="congrats-title">
              {isSpecial
                ? "🎉 Phát Tài Phát Lộc! 🎉"
                : "🎊 Năm Mới Vạn Sự Như Ý! 🎊"}
            </h2>
            <p className="congrats-text">
              {isSpecial
                ? "Chúc Trần Thị Bích năm mới an khang thịnh vượng, vạn sự như ý! 🧧"
                : `Chúc Trần Thị Bích cùng gia đình ta mãi là tổ ấm bình yên, cùng nhau đón một năm mới an khang và vạn sự như ý 🎆`}
            </p>
            <button className="popup-confirm-btn" onClick={onClose}>
              Xác nhận
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default ResultPopup
