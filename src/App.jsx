import { useState, useMemo } from 'react'
import { AnimatePresence, LayoutGroup } from 'framer-motion'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import TarotCard from './components/TarotCard'
import ResultPopup from './components/ResultPopup'
import Sparkles from './components/Sparkles'
import './App.css'

const CARD_SYMBOLS = ['🐉', '🏮', '🧧', '💮', '🎋', '🎊', '🎆', '🪷']
const CARD_NAMES = ['Rồng Vàng', 'Đèn Lồng', 'Phúc Lộc', 'Mai Vàng', 'Trúc Xanh', 'An Khang', 'Pháo Hoa', 'Sen Hồng']

const FIXED_VALUES = [
  { value: 500000, label: null },
  { value: 500000, label: null },
  { value: 200000, label: null },
  { value: 200000, label: null },
  { value: 100000, label: null },
  { value: 100000, label: null },
  { value: 50000, label: null },
  { value: 1000000, label: 'THANH' },
]

function shuffle(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function formatVND(value) {
  return value.toLocaleString('vi-VN') + ' VNĐ'
}

function App() {
  const [alreadyOpened] = useState(() => !!localStorage.getItem('lixi_opened'))
  const cards = useMemo(() => shuffle(FIXED_VALUES), [])
  const [chosenIndex, setChosenIndex] = useState(null)
  const [revealAll, setRevealAll] = useState(false)
  const [chosenRevealed, setChosenRevealed] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [hasChosen, setHasChosen] = useState(false)

  const handleChoose = (index) => {
    if (hasChosen || alreadyOpened) return
    setHasChosen(true)
    setChosenIndex(index)
    // Swap chosen card with a 200k card so user always gets 200,000
    if (cards[index].value !== 200000) {
      const swapIdx = cards.findIndex((c, i) => i !== index && c.value === 200000)
      if (swapIdx !== -1) {
        const temp = { ...cards[index] }
        cards[index] = { ...cards[swapIdx] }
        cards[swapIdx] = temp
      }
    }
    localStorage.setItem('lixi_opened', 'true')
    localStorage.setItem('lixi_cards', JSON.stringify(cards))
    localStorage.setItem('lixi_chosen', String(index))
    const logData = {
      time: serverTimestamp(),
      value: cards[index].value,
      cardName: CARD_NAMES[index],
      symbol: CARD_SYMBOLS[index],
      isSpecial: !!cards[index].label,
      browser: navigator.userAgent,
    }
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(loc => {
        logData.location = {
          city: loc.city,
          region: loc.region,
          country: loc.country_name,
          ip: loc.ip,
        }
      })
      .catch(() => {})
      .finally(() => {
        addDoc(collection(db, 'lixi_log'), logData).catch(() => {})
      })
    // First reveal all other cards
    setTimeout(() => setRevealAll(true), 400)
    // Then show popup for chosen card after others have flipped
    setTimeout(() => setShowPopup(true), 2500)
  }

  const handleClosePopup = () => {
    setShowPopup(false)
    setChosenRevealed(true)
  }

  if (alreadyOpened) {
    const savedCards = JSON.parse(localStorage.getItem('lixi_cards') || '[]')
    const savedChosen = Number(localStorage.getItem('lixi_chosen'))
    const displayCards = savedCards.length === FIXED_VALUES.length ? savedCards : cards

    return (
      <div className="app">
        <Sparkles />
        <header className="header">
          <h1 className="title">🧧 Lì Xì May Mắn 🧧</h1>
          <p className="subtitle">Lì xì chỉ được mở một lần thôi Trần Thị Bích ạ!</p>
        </header>
        <div className="cards-grid">
          {displayCards.map((card, index) => (
            <TarotCard
              key={index}
              index={index}
              card={card}
              symbol={CARD_SYMBOLS[index]}
              name={CARD_NAMES[index]}
              formatVND={formatVND}
              isChosen={false}
              isChosenCard={index === savedChosen}
              isRevealed={true}
              isDisabled={true}
              isHidden={false}
              onChoose={() => {}}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Sparkles />

      <header className="header">
        <h1 className="title">🧧 Lì Xì May Mắn 🧧</h1>
        <p className="subtitle">
          {hasChosen ? 'Bạn đã chọn lá bài!' : 'Mời Trần Thị Bích chọn một lá bài!'}
        </p>
      </header>

      <LayoutGroup>
        <div className="cards-grid">
          {cards.map((card, index) => (
            <TarotCard
              key={index}
              index={index}
              layoutId={`card-${index}`}
              card={cards[index]}
              symbol={CARD_SYMBOLS[index]}
              name={CARD_NAMES[index]}
              formatVND={formatVND}
              isChosen={chosenIndex === index && !chosenRevealed}
              isChosenCard={chosenIndex === index}
              isRevealed={(revealAll && chosenIndex !== index) || (chosenRevealed && chosenIndex === index)}
              isDisabled={hasChosen && chosenIndex !== index}
              isHidden={showPopup && chosenIndex === index}
              onChoose={() => handleChoose(index)}
            />
          ))}
        </div>

        <AnimatePresence>
          {showPopup && chosenIndex !== null && (
            <ResultPopup
              layoutId={`card-${chosenIndex}`}
              card={cards[chosenIndex]}
              symbol={CARD_SYMBOLS[chosenIndex]}
              name={CARD_NAMES[chosenIndex]}
              formatVND={formatVND}
              onClose={handleClosePopup}
            />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </div>
  )
}

export default App
