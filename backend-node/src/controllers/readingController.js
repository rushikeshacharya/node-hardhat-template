import { storeReading, findReading } from "../services/readingService.js";
import { getContractInstance } from "../config/blockchain.js";
import { ethers } from "ethers";

/**
 * POST /api/readings
 * body: { sensorId, timestamp, temperature, unit, location: { latitude, longitude } }
 */
const postReading = async (req, res) => {
  try {
    const payload = req.body;

    if (
      !payload.sensorId ||
      !payload.timestamp ||
      payload.temperature === undefined ||
      !payload.location
    ) {
      return res.status(400).json({ error: "missing required fields" });
    }

    const { receipt, doc } = await storeReading(payload);

    res.json({
      message: "stored",
      txHash: receipt.transactionHash ?? receipt.hash,
      blockNumber: receipt.blockNumber,
      reading: doc,
    });
  } catch (err) {
    console.error("postReading error:", err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * GET /api/readings/verify?sensorId=...&timestamp=...
 * returns: { onChainHash, offChainHash, match: boolean, reading }
 */
const verifyReading = async (req, res) => {
  try {
    const { sensorId, timestamp } = req.query;
    if (!sensorId || !timestamp)
      return res.status(400).json({ error: "missing sensorId or timestamp" });

    const contract = getContractInstance();
    const onChainHash = await contract.getReadingMeta(
      sensorId,
      Number(timestamp)
    ); // bytes32

    const offChainDoc = await findReading(sensorId, Number(timestamp));
    if (!offChainDoc)
      return res.status(404).json({ error: "off-chain reading not found" });

    // Recompute canonical JSON and hash to verify
    const canonical = JSON.stringify({
      sensorId: offChainDoc.sensorId,
      timestamp: offChainDoc.timestamp.toString(),
      temperature: offChainDoc.temperature.toString(),
      unit: offChainDoc.unit,
      location: {
        latitude: offChainDoc.location.latitude,
        longitude: offChainDoc.location.longitude,
      },
    });

    const offChainHash = ethers.keccak256(ethers.toUtf8Bytes(canonical));
    const match = onChainHash === offChainHash;

    res.json({
      sensorId,
      timestamp: Number(timestamp),
      onChainHash,
      offChainHash,
      match,
      reading: offChainDoc,
    });
  } catch (err) {
    console.error("verifyReading error:", err);
    // If contract.getReadingMeta reverts because not found, provide helpful error
    return res.status(404).json({
      error: "No reading found on-chain for given sensorId and timestamp",
      details: err.reason || err.message, // ethers v6 adds err.reason
    });
  }
};

export { postReading, verifyReading };
