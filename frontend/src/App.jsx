import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import './App.css'
import NFTCard from './components/NFTCard'

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS
const SEPOLIA_RPC_URL = import.meta.env.VITE_SEPOLIA_RPC_URL
const ABI = [
  // 這是合約的 ABI（只需要 safeMint 和 tokenURI 部分）
  "function tokenURI(uint256 tokenId) public view returns (string memory)"
]

function App() {
  const [walletAddress, setWalletAddress] = useState(null)
  const [nftData, setNftData] = useState(null)
  const [error, setError] = useState(null)

  // 連接 MetaMask
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('Please install MetaMask Wallet')
      }
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setWalletAddress(account)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        setWalletAddress(accounts[0])
      }
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
    }
  }, [])

  const handleMint = async (e) => {
    e.preventDefault()
    const form = e.target
    const co2 = form.co2.value
    const level = form.level.value

    try {
      const metadata = {
        name: 'PlanetKeeper NFT',
        description: 'Awarded for your carbon reduction!',
        image: 'ipfs://YOUR_IMAGE_CID',
        attributes: [
          { trait_type: 'CO2 Reduced', value: co2 },
          { trait_type: 'Level', value: level }
        ]
      }

      const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': import.meta.env.VITE_PINATA_API_KEY,
          'pinata_secret_api_key': import.meta.env.VITE_PINATA_SECRET
                },
        body: JSON.stringify(metadata)
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(`上傳 metadata 失敗: ${errorData.error || res.statusText}`)
      }
      const result = await res.json()
      const ipfsUrl = `ipfs://${result.IpfsHash}`

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(CONTRACT_ADDRESS, [
        "function safeMint(address to, string memory uri) public"
      ], signer)

      const tx = await contract.safeMint(walletAddress, ipfsUrl)
      await tx.wait()
      setNftData(metadata)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="App">
      <h1>PlanetKeeper NFT</h1>
      {error && <div className="error-message">{error}</div>}
      
      {walletAddress ? (
        <>
          <p>Wallet Address: {walletAddress}</p>
          <div className="nft-container">
            {nftData && (
              <NFTCard
                userName="Nina"
                walletSuffix={walletAddress?.slice(-4)}
                co2={nftData.attributes.find(attr => attr.trait_type === 'CO2 Reduced')?.value}
                level={nftData.attributes.find(attr => attr.trait_type === 'Level')?.value}
                timestamp={Date.now()}
                tokenId="1"
              />
            )}
            <div className="mint-form">
              <h2>Mint Carbon Reduction NFT</h2>
              <form onSubmit={handleMint}>
                <input name="co2" placeholder="CO2 Reduced (ex: 1.2)" required />
                <input name="level" placeholder="Level (ex: Beginner)" required />
                <button type="submit">Mint NFT</button>
              </form>
            </div>
          </div>
        </>
      ) : (
        <button onClick={connectWallet} className="connect-button">Connect Wallet</button>
      )}
    </div>
  )
}

export default App
