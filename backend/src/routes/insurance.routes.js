import express from "express";
import { getInsurancePlans, getInsurancePlan, subscribeToPlan, calculateCoverageEstimate } from "../controllers/insurance.controller.js";

const router = express.Router();

router.get("/", getInsurancePlans);
router.get("/:id", getInsurancePlan);
router.post("/subscribe", subscribeToPlan);
router.post("/calculate-coverage", calculateCoverageEstimate);

export default router;
