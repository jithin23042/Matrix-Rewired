import { subscriptions, payouts } from "../data/db.js";

export const triggerWeatherEvent = (req, res) => {
  const { workerId, eventType, severity } = req.body;

  if (!workerId || !eventType) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const subscription = subscriptions.find(
    s => String(s.workerId) === String(workerId) && s.active
  );

  if (!subscription) {
    return res.status(400).json({ message: "Worker has no active subscription" });
  }

  // Trigger object
  const trigger = {
    id: "trigger_" + Date.now(),
    workerId,
    eventType,
    severity: severity || "moderate",
    timestamp: new Date()
  };

  // 🔥 ADD THIS (CORE FIX)
  const payout = {
    id: "payout_" + Date.now(),
    workerId,
    amount: 100, // fixed demo value
    eventType,
    timestamp: new Date()
  };

  payouts.push(payout);

  res.json({
    message: "Trigger → Claim → Payout completed",
    trigger,
    payout
  });
};

export const getTriggerHistory = (req, res) => {
  res.json({ message: "Trigger history not implemented" });
};