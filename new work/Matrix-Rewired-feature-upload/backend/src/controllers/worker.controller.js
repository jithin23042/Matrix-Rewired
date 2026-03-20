import { addUser, findUserByName, loadUsers } from "../data/users.service.js";

export const registerWorker = async (req, res) => {
  const { name, city, platform, workingHours, avgHourlyIncome, idProofType, idProofNumber, password } = req.body;

  if (!name || !city || !idProofType || !idProofNumber || !password) {
    return res.status(400).json({ message: "Invalid input - all fields required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    console.log('Register request payload', { name, city, platform, workingHours, avgHourlyIncome, idProofType, idProofNumber, password: password && '***' });
    const user = await addUser({ name, city, platform, workingHours, avgHourlyIncome, idProofType, idProofNumber, password });
    console.log('User added:', user.id, user.name);
    res.json({ workerId: user.id, message: "Worker registered successfully" });
  } catch (err) {
    console.error('registerWorker error', err);
    if (err.message === "User already exists") {
      return res.status(409).json({ message: "A user with this name already exists" });
    }
    return res.status(500).json({ message: "Failed to register user" });
  }
};

export const loginWorker = async (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return res.status(400).json({ message: "Name and password are required" });
  }

  const user = await findUserByName(name);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const { password: _, ...userSafe } = user;
  res.json({ message: "Login successful", user: userSafe });
};


export const getWorker = async (req, res) => {
  const user = await findUserByName(req.params.id) || (await loadUsers()).find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: "Worker not found" });
  }
  const { password, ...safeUser } = user;
  return res.json(safeUser);
};