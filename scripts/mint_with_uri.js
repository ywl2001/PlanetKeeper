// scripts/mint_with_uri.js
require('dotenv').config()
const hre = require("hardhat")
const fs = require("fs")

async function main() {
    const contractJson = JSON.parse(fs.readFileSync("contract-address.json", "utf-8"))
    const network = hre.network.name

    if (!contractJson[network] || !contractJson[network].CarbonSaverNFT) {
        throw new Error(`⚠️ CarbonSaverNFT address not found for network "${network}" in contract-address.json`)
    }
    const contractAddress = contractJson[network].CarbonSaverNFT
    
  const CarbonSaverNFT = await hre.ethers.getContractAt("CarbonSaverNFT", contractAddress)

  const recipient = "0xdd889a2b6AD69E387b6D1719813d8b01058640fc" // 你要鑄給的地址
  const tokenURI = "ipfs://Qmf9JprRvuj4SBgkZ2azS3fFzU7e5mFxqBs7Nw4gWGEehk" // Pinata 上的 URI

  const tx = await CarbonSaverNFT.safeMint(recipient, tokenURI)
  await tx.wait()

  console.log("✅ NFT minted with metadata URI:", tokenURI)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
//✅ NFT minted with metadata URI: ipfs://Qmf9JprRvuj4SBgkZ2azS3fFzU7e5mFxqBs7Nw4gWGEehk