const { network } = require("hardhat");
const { saveContractAddress } = require("../scripts/utils/writeAddress");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const contract = await deploy("CarbonSaverNFT", {
        from: deployer,
        args: [],
        log: true,
    });

    saveContractAddress(network.name, "CarbonSaverNFT", contract.address);
};

module.exports.tags = ["all", "planetkeeper"];
