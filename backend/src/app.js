import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import workerRoutes from "./routes/worker.routes.js";
import insuranceRoutes from "./routes/insurance.routes.js";
import payoutRoutes from "./routes/payout.routes.js";
import triggerRoutes from "./routes/trigger.routes.js";
import subscriptionRoutes from "./routes/subscription.routes.js";

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= API ROUTES =================
app.use("/subscription", subscriptionRoutes);
app.use("/worker", workerRoutes);
app.use("/insurance", insuranceRoutes);
app.use("/payout", payoutRoutes);
app.use("/trigger", triggerRoutes);

// API health check
app.get("/api", (req, res) => {
  res.send("API running");
});

// ================= PATH SETUP =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= FRONTEND SERVING =================

// // Serve static files
// const frontendPath = path.join(__dirname, "../../gigsure-dashboard/dist");
// app.use(express.static(frontendPath));

// // Catch-all handler (NO wildcard pattern issue)
// app.use((req, res) => {
//   res.sendFile(path.join(frontendPath, "index.html"));
// });

// ================= PORT =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});