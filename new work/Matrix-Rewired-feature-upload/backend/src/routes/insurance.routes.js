import express from "express";
import { subscribeInsurance, getSubscription, getAllSubscriptions, cancelSubscription } from "../controllers/insurance.controller.js";

const router = express.Router();

router.post("/subscribe", subscribeInsurance);
router.get("/subscription/:workerId", getSubscription);
router.get("/all", getAllSubscriptions);
router.post("/cancel", cancelSubscription);

export default router;
