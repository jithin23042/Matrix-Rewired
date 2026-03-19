import { workers } from "../data/db.js";
import { calculateCoverage } from "../services/risk.service.js";

const insurancePlans = [
  {
    id: "normal",
    name: "Normal Plan",
    weeklyPremium: 35,
    coverage: "Basic weather protection",
    features: ["Rain coverage", "Basic flood protection"],
    riskScore: 60
  },
  {
    id: "basic",
    name: "Basic Plan",
    weeklyPremium: 45,
    coverage: "Standard weather and disruption protection",
    features: ["Rain coverage", "Flood protection", "Curfew coverage"],
    riskScore: 40
  },
  {
    id: "premium",
    name: "Premium Plan",
    weeklyPremium: 65,
    coverage: "Complete protection package",
    features: ["All weather coverage", "Flood protection", "Curfew coverage", "Priority payouts", "24/7 support"],
    riskScore: 20
  }
];

export const getInsurancePlans = (req, res) => {
  res.json(insurancePlans);
};

export const getInsurancePlan = (req, res) => {
  const plan = insurancePlans.find(p => p.id === req.params.id);
  if (!plan) {
    return res.status(404).json({ message: "Plan not found" });
  }
  res.json(plan);
};

export const subscribeToPlan = (req, res) => {
  const { workerId, planId, customPremium, coverageAmount } = req.body;

  const worker = workers.find(w => w.id === workerId);
  if (!worker) {
    return res.status(404).json({ message: "Worker not found" });
  }

  const plan = insurancePlans.find(p => p.id === planId);
  if (!plan) {
    return res.status(404).json({ message: "Plan not found" });
  }

  // Update worker's insurance plan with custom values
  worker.insurancePlan = planId;
  worker.insuranceActive = true;
  worker.customPremium = customPremium || plan.weeklyPremium;
  worker.coverageAmount = coverageAmount || calculateCoverage(worker.customPremium, worker, planId);

  res.json({
    message: `Successfully subscribed to ${plan.name}`,
    plan: plan,
    customPremium: worker.customPremium,
    coverageAmount: worker.coverageAmount
  });
};

export const calculateCoverageEstimate = (req, res) => {
  const { premium, workerId, planType } = req.body;

  if (!premium || !workerId) {
    return res.status(400).json({ message: "Premium and workerId are required" });
  }

  const worker = workers.find(w => w.id === workerId);
  if (!worker) {
    return res.status(404).json({ message: "Worker not found" });
  }

  const estimate = calculateCoverage(premium, worker, planType);

  res.json({
    premium: premium,
    coverageAmount: estimate,
    coverageRatio: (estimate / premium).toFixed(1),
    estimatedMonthlyCoverage: estimate * 4,
    planType: planType || 'normal'
  });
};
