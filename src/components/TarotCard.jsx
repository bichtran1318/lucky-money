import { motion } from 'framer-motion'
import specialImg from '../assets/IMG_7874.JPG'
import './TarotCard.css'

function TarotCard({ index, layoutId, card, symbol, name, formatVND, isChosen, isChosenCard, isRevealed, isDisabled, isHidden, onChoose }) {
  const isSpecial = card && !!card.label

  return (
    <motion.div
      className="tarot-card-container"
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: isHidden ? 0 : 1,
        y: 0,
        scale: isChosen ? 1.08 : isDisabled ? 0.95 : 1,
      }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <div
        className={`tarot-card ${isChosen ? 'chosen' : ''} ${isDisabled ? 'disabled' : ''} ${isRevealed ? 'revealed' : ''} ${isRevealed && isChosenCard ? 'revealed-chosen' : ''}`}
        style={isRevealed ? { transitionDelay: `${index * 0.15}s` } : undefined}
        onClick={onChoose}
      >
        {/* Back */}
        <motion.div className="card-face card-back" layoutId={isRevealed ? undefined : layoutId}>
          <div className="card-back-inner">
            <div className="card-pattern">
              <div className="card-pattern-symbol">🧧</div>
              <div className="card-question">?</div>
              <p className="card-tap-hint">Chạm để mở</p>
            </div>
          </div>
        </motion.div>

        {/* Front */}
        <div className={`card-face card-front ${isSpecial ? 'card-front-special' : ''}`}>
          {isSpecial ? (
            <>
              <img src={specialImg} alt="Special" className="card-front-image" />
              <div className="card-front-image-overlay-top">
                <p className="card-front-overlay-text">Thanh Tùng</p>
              </div>
              <div className="card-front-image-overlay-bottom">
                <p className="card-front-overlay-text">{card && formatVND(card.value)}</p>
              </div>
            </>
          ) : (
            <div className="card-front-inner">
              <div className="card-front-symbol">{symbol}</div>
              <p className="card-front-name">{name}</p>
              <div className="card-front-divider"></div>
              <p className="card-front-value">
                {card && formatVND(card.value)}
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default TarotCard
