import { subscriptions } from "../data/db.js";

// Simulate weather trigger
export const triggerWeatherEvent = (req, res) => {
  const { workerId, eventType, severity } = req.body;

  if (!workerId || !eventType) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const subscription = subscriptions.find(s => s.workerId === workerId && s.active);

  if (!subscription) {
    return res.status(400).json({ message: "Worker has no active subscription" });
  }

  const trigger = {
    id: "trigger" + Date.now(),
    workerId,
    eventType,
    severity: severity || "moderate",
    timestamp: new Date(),
    triggered: true
  };

  res.json({
    triggerId: trigger.id,
    message: "Weather trigger activated",
    trigger
  });
};

// Get trigger history
export const getTriggerHistory = (req, res) => {
  // This would typically query a triggers table
  res.json({ message: "Trigger history feature coming soon", triggers: [] });
};
