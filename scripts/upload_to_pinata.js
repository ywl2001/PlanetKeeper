// scripts/upload_to_pinata.js
require('dotenv').config()
const axios = require('axios')
const fs = require('fs')
const FormData = require('form-data')

const API_KEY = process.env.PINATA_API_KEY
const API_SECRET = process.env.PINATA_API_SECRET

async function uploadImage(imagePath) {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`
  const data = new FormData()
  data.append('file', fs.createReadStream(imagePath))

  const res = await axios.post(url, data, {
    maxContentLength: Infinity,
    headers: {
      ...data.getHeaders(),
      pinata_api_key: API_KEY,
      pinata_secret_api_key: API_SECRET
    }
  })

  return `ipfs://${res.data.IpfsHash}`
}

async function uploadMetadata(metadata) {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`

  const res = await axios.post(url, metadata, {
    headers: {
      pinata_api_key: API_KEY,
      pinata_secret_api_key: API_SECRET,
      'Content-Type': 'application/json'
    }
  })

  return `ipfs://${res.data.IpfsHash}`
}

async function main() {
  const imagePath = 'metadata/PlanetKeeper.png'
  const imageIpfs = await uploadImage(imagePath)

  const metadata = {
    name: 'PlanetKeeper #1',
    description: 'Awarded for your first carbon reduction record!',
    image: imageIpfs,
    attributes: [
      { trait_type: 'CO2 Reduced', value: '1.2 kg' },
      { trait_type: 'Level', value: 'Beginner' }
    ]
  }

  const metadataUri = await uploadMetadata(metadata)
  console.log('✅ Metadata IPFS URI:', metadataUri)
}

main().catch(console.error)
//✅ Metadata IPFS URI: ipfs://Qmf9JprRvuj4SBgkZ2azS3fFzU7e5mFxqBs7Nw4gWGEehk