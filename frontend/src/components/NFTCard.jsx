import React, { useEffect, useState } from 'react'
import { generateMetalTexture } from '../utils/generateMetalBackground'
import './NFTCard.css'

function NFTCard({ userName, walletSuffix, co2, level, timestamp, tokenId }) {
  const [bgImage, setBgImage] = useState('')

  useEffect(() => {
    const img = generateMetalTexture(level)
    setBgImage(img)
  }, [level])

  return (
    <div className="nft-card" style={{ backgroundImage: `url(${bgImage})` }}>
      <h2>{userName} · {walletSuffix}</h2>
      <p>CO₂ Reduced: {co2} kg</p>
      <p>Level: {level}</p>
      <p>Minted at: {new Date(timestamp).toLocaleString()}</p>
      <p>NFT #{tokenId}</p>
    </div>
  )
}

export default NFTCard
