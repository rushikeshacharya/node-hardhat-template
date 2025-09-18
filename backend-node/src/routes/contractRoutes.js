import { Router } from "express";
import { deploy } from "../controllers/contractController.js";

const router = Router();

router.post("/deploy", deploy);

export default router;
