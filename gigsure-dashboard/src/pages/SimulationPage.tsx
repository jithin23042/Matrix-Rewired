import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudRain, AlertTriangle, CheckCircle2, Timer } from "lucide-react";
import AppNav from "@/components/AppNav";

const SimulationPage = () => {
  const [triggered, setTriggered] = useState(false);
  const [simulating, setSimulating] = useState(false);

  const runSimulation = () => {
    setSimulating(true);
    setTriggered(false);
    setTimeout(() => {
      setTriggered(true);
      setSimulating(false);
    }, 2000);
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
                    <p className="font-data text-lg font-semibold text-foreground">22mm/hr</p>
                  </div>
                  <div className="p-3 bg-background rounded-lg text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Duration</p>
                    <p className="font-data text-lg font-semibold text-foreground">3h 00m</p>
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
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Estimated Payout</p>
                  <p className="font-data text-3xl font-bold text-success">₹450.00</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SimulationPage;
