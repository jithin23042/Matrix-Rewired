import { workers, subscriptions } from "../data/db.js";

// Subscribe to insurance
export const subscribeInsurance = (req, res) => {
  const { workerId } = req.body;

  if (!workerId) {
    return res.status(400).json({ message: "Worker ID is required" });
  }

  const worker = workers.find(w => w.id === workerId);
  if (!worker) {
    return res.status(404).json({ message: "Worker not found" });
  }

  // Use provided weeklyAmount or calculate (5% of weekly earnings)
  const weeklyAmount = req.body.weeklyAmount || (worker.avgHourlyIncome * 60 * 0.05);
  const weeklyPremium = Math.round(weeklyAmount);

  // Risk score based on premium (higher premium = better coverage/risk mitigation)
  const baseRisk = 80;
  const riskReduction = Math.min(weeklyPremium * 0.3, 50); // Max 50% reduction
  const riskScore = Math.floor(baseRisk - riskReduction);

  const subscription = {
    id: "sub" + (subscriptions.length + 1),
    workerId,
    active: true,
    weeklyPremium,
    coverageAmount: Math.round(weeklyPremium * 20),
    riskScore,
    startDate: new Date(),
    status: "active"
  };

  subscriptions.push(subscription);

  res.json({
    subscriptionId: subscription.id,
    message: "Subscription created successfully",
    subscription
  });
};

// Get subscription for worker
export const getSubscription = (req, res) => {
  const { workerId } = req.params;

  const subscription = subscriptions.find(s => s.workerId === workerId);

  if (!subscription) {
    return res.status(404).json({ message: "No subscription found" });
  }

  res.json(subscription);
};

// Get all subscriptions
export const getAllSubscriptions = (req, res) => {
  res.json(subscriptions);
};

// Cancel subscription
export const cancelSubscription = (req, res) => {
  const { workerId } = req.body;

  const subscription = subscriptions.find(s => s.workerId === workerId);

  if (!subscription) {
    return res.status(404).json({ message: "Subscription not found" });
  }

  subscription.active = false;
  subscription.status = "cancelled";

  res.json({ message: "Subscription cancelled", subscription });
};
