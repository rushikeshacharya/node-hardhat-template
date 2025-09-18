import express from "express";
import contractRoutes from "./routes/contractRoutes.js";
import readingRoutes from "./routes/readingRoutes.js";

const app = express();

app.use(express.json()); // for parsing JSON request body

// Routes
app.use("/contract", contractRoutes);
app.use("/api/readings", readingRoutes);

app.get("/", (req, res) => {
  res.send("✅ Blockchain PoC API is running...");
});

export default app;
