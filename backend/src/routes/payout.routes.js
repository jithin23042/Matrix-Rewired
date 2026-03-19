import express from "express";
import { getWorkerInsuranceStatus, createPayout, getWorkerPayouts } from "../controllers/payout.controller.js";

const router = express.Router();

router.get("/status/:workerId", getWorkerInsuranceStatus);
router.post("/", createPayout);
router.get("/:workerId", getWorkerPayouts);

export default router;
