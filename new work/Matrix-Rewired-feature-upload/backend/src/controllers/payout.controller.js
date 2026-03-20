import { subscriptions, payouts } from "../data/db.js";
import { loadUsers } from "../data/users.service.js";

// Create payout (triggered by weather/disruption)
export const createPayout = async (req, res) => {
  const { workerId, reason, hoursLost, disruptionType } = req.body;

  if (!workerId || !hoursLost || !reason) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const users = await loadUsers();
  const worker = users.find(w => w.id === workerId);
  if (!worker) {
    return res.status(404).json({ message: "Worker not found" });
  }

  const subscription = subscriptions.find(s => s.workerId === workerId && s.active);
  if (!subscription) {
    return res.status(400).json({ message: "No active subscription" });
  }

  // Calculate payout: hourly income × hours lost
  const payoutAmount = worker.avgHourlyIncome * hoursLost;

  const payout = {
    id: "payout" + (payouts.length + 1),
    workerId,
    amount: payoutAmount,
    reason,
    hoursLost,
    disruptionType: disruptionType || "weather",
    dateTriggered: new Date(),
    status: "processed",
    processedAt: new Date()
  };

  payouts.push(payout);

  res.json({
    payoutId: payout.id,
    message: "Payout processed successfully",
    payout
  });
};

// Get payouts for worker
export const getWorkerPayouts = (req, res) => {
  const { workerId } = req.params;

  const workerPayouts = payouts.filter(p => p.workerId === workerId);

  res.json(workerPayouts);
};

// Get all payouts
export const getAllPayouts = (req, res) => {
  res.json(payouts);
};

// Get latest payout
export const getLatestPayout = (req, res) => {
  const { workerId } = req.params;

  const latest = payouts.filter(p => p.workerId === workerId).sort((a, b) => 
    new Date(b.dateTriggered) - new Date(a.dateTriggered)
  )[0];

  if (!latest) {
    return res.status(404).json({ message: "No payouts found" });
  }

  res.json(latest);
};
