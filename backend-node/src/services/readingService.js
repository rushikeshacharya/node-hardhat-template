import { ethers } from "ethers";
import { getContractInstance } from "../config/blockchain.js";
import Reading from "../models/Reading.js";

/**
 * Save reading: compute hash -> call contract.storeReading -> wait for receipt -> save to Mongo
 * @param {Object} payload { sensorId, timestamp, temperature, unit, location: {latitude,longitude} }
 */
const storeReading = async (payload) => {
  const { sensorId, timestamp, temperature, unit, location } = payload;

  // 1) build canonical JSON string (deterministic order)
  const canonical = JSON.stringify({
    sensorId,
    timestamp,
    temperature,
    unit,
    location: { latitude: location.latitude, longitude: location.longitude },
  });

  // 2) compute keccak256 hash (ethers v6)
  const dataHash = ethers.keccak256(ethers.toUtf8Bytes(canonical)); // 0x...
  const dataHashBytes32 = dataHash; // stored as hex string in Mongo and sent to contract as bytes32

  // 3) call contract
  const contract = getContractInstance();
  const tx = await contract.storeReading(sensorId, timestamp, dataHashBytes32);
  const receipt = await tx.wait();

  // 4) persist to Mongo
  const doc = new Reading({
    sensorId,
    timestamp,
    temperature,
    unit,
    location: { latitude: location.latitude, longitude: location.longitude },
    dataHash: dataHashBytes32,
    txHash: receipt.transactionHash ?? receipt.hash,
    blockNumber: receipt.blockNumber,
    status: "confirmed",
  });

  await doc.save();
  return { receipt, doc };
};

const findReading = async (sensorId, timestamp) => {
  return Reading.findOne({ sensorId, timestamp }).lean();
};

export { storeReading, findReading };
