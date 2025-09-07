import { deployContract, storeReading, getReading } from "../services/contractService.js";

const deploy = async (req, res) => {
  try {
    const address = await deployContract();
    res.json({ msg: "✅ Contract Deployed Successfully", contractAddress: address });
  } catch (err) {
    res.status(500).json({ error: "Contract deployment failed" });
  }
};

const store = async (req, res) => {
  try {
    const { timestamp, temperature, unit, latitude, longitude } = req.body;
    const receipt = await storeReading(timestamp, temperature, unit, latitude, longitude);
    res.json({ msg: "✅ Reading stored successfully", txId: receipt.hash, blockNumber: receipt.blockNumber });
  } catch (err) {
    res.status(500).json({ error: "Storing reading failed" });
  }
};

const retrieve = async (req, res) => {
  try {
    const { timestamp, latitude, longitude } = req.body;
    const result = await getReading(timestamp, latitude, longitude);
    res.json({ msg: "✅ Reading retrieved successfully", result });
  } catch (err) {
    res.status(500).json({ error: "Retrieving reading failed" });
  }
};

export { deploy, store, retrieve };
