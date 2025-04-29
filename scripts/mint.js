const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    const addressesPath = path.join(__dirname, "..", "contract-address.json");

    if (!fs.existsSync(addressesPath)) {
        throw new Error("contract-address.json not found. Please deploy the contract first.");
    }

    const addresses = JSON.parse(fs.readFileSync(addressesPath, "utf8"));
    const contractAddress = addresses[network.name]?.CarbonSaverNFT;

    if (!contractAddress) {
        throw new Error(`No CarbonSaverNFT address found for network ${network.name}`);
    }

    const [signer] = await ethers.getSigners();
    const contract = await ethers.getContractAt("CarbonSaverNFT", contractAddress);

    console.log(`Minting NFT to: ${signer.address}`);
    const dummyURI = "https://example.com/metadata/1.json"; // 你之後可以換成 IPFS URI

    const tx = await contract.safeMint(signer.address, dummyURI);
    await tx.wait();

    console.log("NFT minted successfully!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
