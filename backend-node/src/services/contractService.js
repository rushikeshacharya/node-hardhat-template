import { storageFactory, getContractInstance } from "../config/blockchain.js";

const deployContract = async () => {
  try {
    const storageContract = await storageFactory.deploy();
    await storageContract.waitForDeployment();

    const contractAddress = await storageContract.getAddress();
    return contractAddress;
  } catch (err) {
    console.error("❌ Deployment failed:", err);
    throw err;
  }
};

const storeReading = async (timestamp, temperature, unit, latitude, longitude) => {
  try {
    const contractInstance = getContractInstance();
    const tx = await contractInstance.storeReading(timestamp, temperature, unit, latitude, longitude);
    const receipt = await tx.wait();
    return receipt;
  } catch (err) {
    console.error("❌ Error in storeReading:", err);
    throw err;
  }
};

const getReading = async (timestamp, latitude, longitude) => {
  try {
    const contractInstance = getContractInstance();
    const result = await contractInstance.getReading(timestamp, latitude, longitude);

    return {
      timestamp,
      temp: result[0].toString() + " " + result[1],
      location: result[2] + " " + result[3],
    };
  } catch (err) {
    console.error("❌ Error in getReading:", err);
    throw err;
  }
};

export { deployContract, storeReading, getReading };
