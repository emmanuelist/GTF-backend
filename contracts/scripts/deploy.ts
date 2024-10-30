import { ethers } from "hardhat";
import { Token__factory } from "../typechain-types";
import { verify } from "../utils/verify";

async function main() {
  try {
    // Deploy parameters
    const name = "MyToken";
    const symbol = "MTK";
    const initialSupply = ethers.utils.parseEther("1000000"); // 1 million tokens
    const maxSupply = ethers.utils.parseEther("10000000"); // 10 million tokens

    // Get deployer
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // Deploy contract
    const TokenFactory = (await ethers.getContractFactory("Token")) as Token__factory;
    const token = await TokenFactory.deploy(name, symbol, initialSupply, maxSupply);
    await token.deployed();

    console.log("Token deployed to:", token.address);

    // Verify contract if on a supported network
    if (process.env.ETHERSCAN_API_KEY) {
      console.log("Waiting for block confirmations...");
      await token.deployTransaction.wait(6);
      await verify(token.address, [name, symbol, initialSupply, maxSupply]);
    }

    return token.address;
  } catch (error) {
    console.error("Error during deployment:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });