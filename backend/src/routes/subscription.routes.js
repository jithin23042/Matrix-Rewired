import express from "express";
import createSubscription from "../controllers/subscription.controller.js";

const router = express.Router();

router.post("/create", createSubscription);

export default router;