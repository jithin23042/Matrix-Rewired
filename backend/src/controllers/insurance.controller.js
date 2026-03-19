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

  // Calculate weekly premium (5% of weekly earnings)
  const weeklyEarnings = worker.avgHourlyIncome * 60; // Assuming ~60 hours per week
  const weeklyPremium = Math.round(weeklyEarnings * 0.05);

  const subscription = {
    id: "sub" + (subscriptions.length + 1),
    workerId,
    active: true,
    weeklyPremium,
    riskScore: Math.floor(Math.random() * 100),
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
