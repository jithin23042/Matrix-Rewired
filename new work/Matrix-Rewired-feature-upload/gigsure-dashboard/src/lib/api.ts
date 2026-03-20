const API_BASE = "http://localhost:5000";

// Worker API
export const workerAPI = {
  register: async (data) => {
    const res = await fetch(`${API_BASE}/worker/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getWorker: async (id) => {
    const res = await fetch(`${API_BASE}/worker/${id}`);
    return res.json();
  },
  login: async (data) => {
    const res = await fetch(`${API_BASE}/worker/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

// Insurance API
export const insuranceAPI = {
  subscribe: async (workerId, weeklyAmount) => {
    const res = await fetch(`${API_BASE}/insurance/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workerId, weeklyAmount }),
    });
    return res.json();
  },

  getSubscription: async (workerId) => {
    const res = await fetch(`${API_BASE}/insurance/subscription/${workerId}`);
    if (!res.ok) return null;
    return res.json();
  },
  cancel: async (workerId) => {
    const res = await fetch(`${API_BASE}/insurance/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workerId }),
    });
    return res.json();
  },
};

// Payout API
export const payoutAPI = {
  create: async (data) => {
    const res = await fetch(`${API_BASE}/payout/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getWorkerPayouts: async (workerId) => {
    const res = await fetch(`${API_BASE}/payout/worker/${workerId}`);
    return res.json();
  },
  getLatestPayout: async (workerId) => {
    const res = await fetch(`${API_BASE}/payout/latest/${workerId}`);
    if (!res.ok) return null;
    return res.json();
  },
};

// Trigger API
export const triggerAPI = {
  triggerWeather: async (data) => {
    const res = await fetch(`${API_BASE}/trigger/weather`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
