// scripts/update_env.js
const fs = require('fs')
const path = require('path')

// 讀取合約地址
const addressPath = path.join(__dirname, '../contract-address.json')
const addressData = JSON.parse(fs.readFileSync(addressPath, 'utf-8'))

// 假設目前用的是 sepolia，合約名稱為 CarbonSaverNFT
const contractAddress = addressData['sepolia']['CarbonSaverNFT']

// 要寫入的 .env 路徑（在 frontend 資料夾下）
const envPath = path.join(__dirname, '../frontend/.env')

// 構建內容
const envContent = `VITE_CONTRACT_ADDRESS=${contractAddress}\n`

// 寫入 .env
fs.writeFileSync(envPath, envContent)

console.log(`✅ Contract address updated to frontend/.env as ${contractAddress}`)
