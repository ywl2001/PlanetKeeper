// scripts/utils/writeAddress.js
const fs = require("fs");
const path = require("path");

function saveContractAddress(networkName, contractName, address) {
    const filePath = path.join(__dirname, "..", "..", "contract-address.json");
    let addresses = {};

    if (fs.existsSync(filePath)) {
        addresses = JSON.parse(fs.readFileSync(filePath, "utf8"));
    }

    if (!addresses[networkName]) {
        addresses[networkName] = {};
    }

    addresses[networkName][contractName] = address;
    fs.writeFileSync(filePath, JSON.stringify(addresses, null, 2));
    console.log(`Saved ${contractName} address on ${networkName}: ${address}`);
}

module.exports = { saveContractAddress };
