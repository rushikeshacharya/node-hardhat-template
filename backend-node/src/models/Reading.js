import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema(
  {
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
  },
  { _id: false }
);

const ReadingSchema = new mongoose.Schema(
  {
    sensorId: { type: String, required: true, index: true },
    timestamp: { type: Number, required: true, index: true }, // unix seconds
    temperature: { type: Number, required: true },
    unit: { type: String, enum: ["C", "F"], default: "C" },
    location: { type: LocationSchema, required: true },

    // proof & chain metadata
    dataHash: { type: String, required: true, index: true }, // 0x prefixed hex bytes32
    txHash: { type: String, required: true, unique: true },
    blockNumber: { type: Number },

    status: {
      type: String,
      enum: ["submitted", "confirmed", "failed"],
      default: "submitted",
    },
  },
  { timestamps: true }
);

ReadingSchema.index({ sensorId: 1, timestamp: 1 }, { unique: true });

export default mongoose.model("Reading", ReadingSchema);
