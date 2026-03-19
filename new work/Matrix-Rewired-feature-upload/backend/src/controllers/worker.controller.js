import { workers } from "../data/db.js";

export const registerWorker = (req, res) => {
  const { name, city, platform, workingHours, avgHourlyIncome, idProofType, idProofNumber } = req.body;

  if (!name || !city || !idProofType || !idProofNumber) {
    return res.status(400).json({ message: "Invalid input - all fields required" });
  }

  const worker = {
    id: "w" + (workers.length + 1),
    name,
    city,
    platform,
    workingHours,
    avgHourlyIncome,
    idProofType,
    idProofNumber,
    registeredAt: new Date()
  };

  workers.push(worker);

  res.json({
    workerId: worker.id,
    message: "Worker registered successfully"
  });
};

export const getWorker = (req, res) => {
  const worker = workers.find(w => w.id === req.params.id);

  if (!worker) {
    return res.status(404).json({ message: "Worker not found" });
  }

  res.json(worker);
};