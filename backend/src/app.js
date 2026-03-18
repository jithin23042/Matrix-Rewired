import express from "express";
import cors from "cors";
import workerRoutes from "./routes/worker.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/worker", workerRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});