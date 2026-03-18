import express from "express";

import { registerWorker, getWorker } from "../controllers/worker.controller.js";

const router = express.Router();

router.post("/register", registerWorker);
router.get("/:id", getWorker);

export default router;   // ✅ THIS LINE IS CRITICAL