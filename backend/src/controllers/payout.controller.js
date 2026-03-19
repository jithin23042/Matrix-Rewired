import { workers, payouts } from "../data/db.js";

export const getWorkerInsuranceStatus = (req, res) => {
  const workerId = req.params.workerId;
  const worker = workers.find(w => w.id === workerId);

  if (!worker) {
    return res.status(404).json({ message: "Worker not found" });
  }

  // Count payouts for this worker
  const workerPayouts = payouts.filter(p => p.workerId === workerId);

  const status = {
    insuranceActive: worker.insuranceActive || false,
    insurancePlan: worker.insurancePlan || null,
    customPremium: worker.customPremium || null,
    coverageAmount: worker.coverageAmount || null,
    totalPayouts: workerPayouts.length,
    totalPayoutAmount: workerPayouts.reduce((sum, p) => sum + p.amount, 0)
  };

  res.json(status);
};

export const createPayout = (req, res) => {
  const { workerId, amount, reason } = req.body;

  const worker = workers.find(w => w.id === workerId);
  if (!worker) {
    return res.status(404).json({ message: "Worker not found" });
  }

  if (!worker.insuranceActive) {
    return res.status(400).json({ message: "Worker does not have active insurance" });
  }

  const payout = {
    id: "p" + (payouts.length + 1),
    workerId,
    amount,
    reason,
    date: new Date().toISOString(),
    status: "processed"
  };

  payouts.push(payout);

  res.json({
    message: "Payout created successfully",
    payout: payout
  });
};

export const getWorkerPayouts = (req, res) => {
  const workerId = req.params.workerId;
  const workerPayouts = payouts.filter(p => p.workerId === workerId);

  res.json(workerPayouts);
};
