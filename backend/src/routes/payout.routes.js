import express from "express";
import { createPayout, getWorkerPayouts, getAllPayouts, getLatestPayout } from "../controllers/payout.controller.js";

const router = express.Router();

router.post("/create", createPayout);
router.get("/worker/:workerId", getWorkerPayouts);
router.get("/latest/:workerId", getLatestPayout);
router.get("/all", getAllPayouts);

export default router;
