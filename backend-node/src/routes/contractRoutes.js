import { Router } from "express";
import { deploy, store, retrieve } from "../controllers/contractController.js";

const router = Router();

router.post("/deploy", deploy);
router.post("/storeReading", store);
router.get("/getReading", retrieve);

export default router;
