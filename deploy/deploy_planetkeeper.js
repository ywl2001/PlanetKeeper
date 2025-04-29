// deploy/deploy_planetkeeper.js
const { network } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    
    console.log(`Deploying contract with account: ${deployer}`);
    const planetKeeper = await deploy("CarbonSaverNFT", {
        from: deployer,
        args: [],
        log: true,
    });

    console.log(`Contract deployed at address: ${planetKeeper.address}`);
};

module.exports.tags = ["all", "planetkeeper"];