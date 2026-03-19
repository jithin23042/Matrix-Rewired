import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudRain, AlertTriangle, CheckCircle2, Timer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppNav from "@/components/AppNav";

const SimulationPage = () => {
  const navigate = useNavigate();
  const [triggered, setTriggered] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simulationData, setSimulationData] = useState(null);
  const [workerData, setWorkerData] = useState(null);

  useEffect(() => {
    const fetchWorkerData = async () => {
      const workerId = localStorage.getItem("workerId");
      if (!workerId) {
        navigate("/register");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/worker/${workerId}`);
        if (response.ok) {
          const worker = await response.json();
          setWorkerData(worker);
        }
      } catch (error) {
        console.error("Error fetching worker data:", error);
      }
    };

    fetchWorkerData();
  }, [navigate]);

  const runSimulation = async () => {
    const workerId = localStorage.getItem("workerId");
    if (!workerId) {
      navigate("/register");
      return;
    }

    setSimulating(true);
    setTriggered(false);
    setSimulationData(null);

    try {
      // Simulate heavy rainfall event
      const rainfallMm = 22; // 22mm/hr - above 15mm/hr threshold
      const durationHours = 3; // 3 hours disruption

      const response = await fetch("http://localhost:5000/trigger/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workerId,
          rainfallMm,
          durationHours
        }),
      });

      if (response.ok) {
        const result = await response.json();
        
        // Wait for 2 seconds to show the simulation progress
        setTimeout(() => {
          setSimulationData(result);
          setTriggered(result.triggered);
          setSimulating(false);
        }, 2000);
      } else {
        const error = await response.json();
        alert(error.message || "Simulation failed");
        setSimulating(false);
      }
    } catch (error) {
      console.error("Error running simulation:", error);
      alert("Failed to run simulation. Please try again.");
      setSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <div className="container py-6 max-w-lg space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="bg-card rounded-xl shadow-card p-6 text-center"
        >
          <CloudRain className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-medium tracking-tight text-foreground mb-1">Disruption Simulator</h1>
          <p className="text-sm text-muted-foreground mb-6">Test how the parametric trigger system works</p>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={runSimulation}
            disabled={simulating}
            className="w-full py-3 bg-warning text-warning-foreground font-semibold rounded-md shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_2px_4px_rgba(0,0,0,0.1)] hover:brightness-110 transition-all disabled:opacity-50"
          >
            {simulating ? "Simulating..." : "Simulate Heavy Rain Event"}
          </motion.button>
        </motion.div>

        {/* Simulation Progress */}
        <AnimatePresence>
          {simulating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card rounded-xl shadow-card p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Timer className="h-5 w-5 text-warning animate-spin" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Analyzing conditions...</p>
                  <p className="text-sm text-muted-foreground">Checking rainfall threshold: 15mm/hr</p>
                </div>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "linear" }}
                  className="h-full bg-warning rounded-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {triggered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
              className="space-y-3"
            >
              <div className="bg-card rounded-xl shadow-card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Disruption Detected</p>
                    <p className="text-sm text-muted-foreground">Heavy rainfall event triggered</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-background rounded-lg text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Rainfall</p>
                    <p className="font-data text-lg font-semibold text-foreground">
                      {simulationData?.rainfallMm || 22}mm/hr
                    </p>
                  </div>
                  <div className="p-3 bg-background rounded-lg text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Duration</p>
                    <p className="font-data text-lg font-semibold text-foreground">
                      {simulationData?.durationHours || 3}h 00m
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl shadow-card p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Eligible for Payout</p>
                    <p className="text-sm text-muted-foreground">Threshold exceeded — automatic compensation applies</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-background rounded-lg text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Payout Amount</p>
                  <p className="font-data text-3xl font-bold text-success">
                    ₹{simulationData?.payout?.amount?.toFixed(2) || "450.00"}
                  </p>
                </div>
                {simulationData?.payout && (
                  <div className="mt-3 text-center">
                    <p className="text-xs text-muted-foreground">
                      Payout ID: {simulationData.payout.id}
                    </p>
                    <p className="text-xs text-success mt-1">
                      ✓ Automatically credited to your account
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SimulationPage;

