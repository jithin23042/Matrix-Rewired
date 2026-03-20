import express from "express";
import { triggerWeatherEvent, getTriggerHistory } from "../controllers/trigger.controller.js";

const router = express.Router();

router.post("/weather", triggerWeatherEvent);
router.get("/history/:workerId", getTriggerHistory);

export default router;
