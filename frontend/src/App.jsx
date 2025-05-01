import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import './App.css'

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS
const SEPOLIA_RPC_URL = import.meta.env.VITE_SEPOLIA_RPC_URL
const ABI = [
  // 這是合約的 ABI（只需要 safeMint 和 tokenURI 部分）
  "function tokenURI(uint256 tokenId) public view returns (string memory)"
]

function App() {
  const [walletAddress, setWalletAddress] = useState(null)
  const [nftData, setNftData] = useState(null)

  // 連接 MetaMask
  const connectWallet = async () => {
    if (window.ethereum) {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      setWalletAddress(account)
      const provider = new ethers.JsonRpcProvider(import.meta.env.VITE_SEPOLIA_RPC_URL) // 用你自己的 Infura key
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
      const tokenId = 1  // 假設我們取 id = 1 的 NFT

      try {
        const uri = await contract.tokenURI(tokenId)
        const metadata = await fetch(uri.replace('ipfs://', 'https://ipfs.io/ipfs/'))
          .then(res => res.json())
        setNftData(metadata)
      } catch (err) {
        console.error("Error fetching NFT data:", err)
      }
    } else {
      alert("MetaMask is not installed!")
    }
  }

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setWalletAddress(accounts[0])
      })
    }
  }, [])

  return (
    <div className="App">
      <h1>PlanetKeeper NFT</h1>
      {walletAddress ? (
        <>
          <p>Wallet Address: {walletAddress}</p>
          {nftData ? (
            <div>
              <h2>{nftData.name}</h2>
              <img src={nftData.image.replace('ipfs://', 'https://ipfs.io/ipfs/')} alt={nftData.name} />
              <p>{nftData.description}</p>
              <p>CO2 Reduced: {nftData.attributes[0].value}</p>
              <p>Level: {nftData.attributes[1].value}</p>
            </div>
          ) : (
            <p>Loading NFT data...</p>
          )}
        </>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  )
}

export default App
