import React, { useEffect, useState } from 'react'
import { generateMetalTexture } from '../utils/generateMetalBackground'
import { QRCodeSVG } from 'qrcode.react'
import './NFTCard.css'

// 卡片正面組件
const CardFront = ({ userName, walletSuffix, co2, level, timestamp, tokenId }) => (
  <div className="card-front">
    <h2>{userName} · {walletSuffix}</h2>
    <p>CO₂ Reduced: {co2} kg</p>
    <p>Level: {level}</p>
    <p>Minted at: {new Date(timestamp).toLocaleString()}</p>
    <p>NFT #{tokenId}</p>
    <p className="flip-hint">點擊卡片查看詳細資訊</p>
  </div>
)

// 卡片背面組件
const CardBack = ({ totalCo2, carbonHistory, walletSuffix }) => (
  <div className="card-back">
    <div className="back-content">
      <h3>減碳成就</h3>
      <div className="total-co2">
        <p>累積減碳量</p>
        <h2>{totalCo2.toFixed(2)} kg</h2>
      </div>
      <div className="carbon-history">
        <h4>減碳紀錄</h4>
        {carbonHistory.map((record, index) => (
          <div key={index} className="history-item">
            <span>{record.date}</span>
            <span>{record.amount.toFixed(2)} kg</span>
          </div>
        ))}
      </div>
      <div className="qr-code">
        <QRCodeSVG 
          value={`https://planetsaver.io/profile/${walletSuffix}`}
          size={100}
          level="H"
          includeMargin={true}
        />
      </div>
    </div>
  </div>
)

// 自定義 Hook 處理卡片數據
const useCardData = (co2, level) => {
  const [bgImage, setBgImage] = useState('')
  const [totalCo2, setTotalCo2] = useState(0)
  const [carbonHistory, setCarbonHistory] = useState([])

  useEffect(() => {
    const img = generateMetalTexture(level)
    setBgImage(img)
    // 模擬獲取用戶減碳歷史
    setTotalCo2(parseFloat(co2) * 1.5)
    setCarbonHistory([
      { date: '2024-03-15', amount: parseFloat(co2) * 0.5 },
      { date: '2024-03-10', amount: parseFloat(co2) * 0.3 },
      { date: '2024-03-05', amount: parseFloat(co2) * 0.2 }
    ])
  }, [level, co2])

  return { bgImage, totalCo2, carbonHistory }
}

// 主卡片組件
function NFTCard({ userName, walletSuffix, co2, level, timestamp, tokenId }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const { bgImage, totalCo2, carbonHistory } = useCardData(co2, level)

  const handleCardClick = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="card-container">
      <div 
        className={`card ${isFlipped ? 'flipped' : ''}`} 
        onClick={handleCardClick}
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <CardFront
          userName={userName}
          walletSuffix={walletSuffix}
          co2={co2}
          level={level}
          timestamp={timestamp}
          tokenId={tokenId}
        />
        <CardBack
          totalCo2={totalCo2}
          carbonHistory={carbonHistory}
          walletSuffix={walletSuffix}
        />
      </div>
    </div>
  )
}

export default NFTCard
