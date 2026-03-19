import express from "express";
import { simulateTrigger, checkTriggerStatus } from "../controllers/trigger.controller.js";

const router = express.Router();

router.post("/simulate", simulateTrigger);
router.get("/status/:workerId", checkTriggerStatus);

export default router;