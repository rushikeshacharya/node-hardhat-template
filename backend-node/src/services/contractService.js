import { contractFactory } from "../config/blockchain.js";
import Contract from "../models/Contract.js";

const deployContract = async () => {
  try {
    const storageContract = await contractFactory.deploy();
    await storageContract.waitForDeployment();

    const contractAddress = await storageContract.getAddress();
    await saveContractAddress("TemperatureLogger", contractAddress);
    process.env.CONTRACT_ADDRESS = contractAddress;

    return contractAddress;
  } catch (err) {
    console.error("❌ Deployment failed:", err);
    throw err;
  }
};

export const saveContractAddress = async (name, address, network = "local") => {
  try {
    const contract = new Contract({ name, address, network });
    await contract.save();
    console.log("Contract address saved to MongoDB:", address);
    return contract;
  } catch (err) {
    console.error("Error saving contract address:", err);
    throw err;
  }
};

export const getLatestContractAddress = async (name) => {
  return Contract.findOne({ name }).sort({ deployedAt: -1 });
};

export { deployContract };
