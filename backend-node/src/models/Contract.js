import mongoose from "mongoose";

const contractSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. TemperatureLogger
  address: { type: String, required: true },
  network: { type: String, default: "local" }, // or goerli, mainnet etc.
  deployedBy: { type: String, default: "system" }, // optional
  deployedAt: { type: Date, default: Date.now },
});

const Contract = mongoose.model("Contract", contractSchema);

export default Contract;
