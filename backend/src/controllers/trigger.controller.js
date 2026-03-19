import { workers, payouts } from "../data/db.js";

export const simulateTrigger = (req, res) => {
  const { workerId, rainfallMm, durationHours } = req.body;

  const worker = workers.find(w => w.id === workerId);
  if (!worker) {
    return res.status(404).json({ message: "Worker not found" });
  }

  if (!worker.insuranceActive) {
    return res.status(400).json({ 
      message: "Worker does not have active insurance",
      triggered: false 
    });
  }

  // Check if rainfall exceeds threshold (15mm/hr)
  const threshold = 15;
  const triggered = rainfallMm >= threshold;

  if (!triggered) {
    return res.json({
      triggered: false,
      message: "Rainfall below threshold",
      rainfallMm,
      threshold,
      durationHours
    });
  }

  // Calculate payout based on hourly income and duration
  const hourlyIncome = worker.avgHourlyIncome || 150;
  const payoutAmount = hourlyIncome * durationHours;

  // Create payout
  const payout = {
    id: "p" + (payouts.length + 1),
    workerId,
    amount: payoutAmount,
    reason: `Heavy rainfall disruption - ${rainfallMm}mm/hr for ${durationHours}h`,
    date: new Date().toISOString(),
    status: "processed"
  };

  payouts.push(payout);

  res.json({
    triggered: true,
    message: "Disruption detected - Payout processed",
    rainfallMm,
    threshold,
    durationHours,
    payout: {
      id: payout.id,
      amount: payoutAmount,
      reason: payout.reason,
      date: payout.date
    }
  });
};

export const checkTriggerStatus = (req, res) => {
  const workerId = req.params.workerId;
  const worker = workers.find(w => w.id === workerId);

  if (!worker) {
    return res.status(404).json({ message: "Worker not found" });
  }

  const workerPayouts = payouts.filter(p => p.workerId === workerId);
  const lastPayout = workerPayouts.length > 0 ? workerPayouts[workerPayouts.length - 1] : null;

  res.json({
    insuranceActive: worker.insuranceActive,
    totalPayouts: workerPayouts.length,
    lastPayout: lastPayout ? {
      id: lastPayout.id,
      amount: lastPayout.amount,
      reason: lastPayout.reason,
      date: lastPayout.date
    } : null
  });
};