import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  contractName: { type: String, default: "TemperatureLogger" },
  contractAddress: { type: String, required: true },
  txHash: { type: String, required: true },
  blockNumber: { type: Number, required: true },
  timestamp: { type: Number, required: true }, // reading timestamp
  temperature: { type: Number, required: true },
  unit: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
