import { Router } from "express";
import {
  postReading,
  verifyReading,
} from "../controllers/readingController.js";

const router = Router();

router.post("/", postReading); // POST /api/readings
router.get("/verify", verifyReading); // GET  /api/readings/verify?sensorId=...&timestamp=...

export default router;
