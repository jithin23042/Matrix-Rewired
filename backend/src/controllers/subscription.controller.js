import { subscriptions } from "../data/db.js";

const createSubscription = (req, res) => {
  const { workerId, premium } = req.body;

  if (!workerId || !premium) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const subscription = {
    id: "sub_" + Date.now(),
    workerId,
    weeklyPremium: premium,
    active: true
  };

  subscriptions.push(subscription);

  res.json({
    message: "Subscription created",
    subscription
  });
};

export default createSubscription;