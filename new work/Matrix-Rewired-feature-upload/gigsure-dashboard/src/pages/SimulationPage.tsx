import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CloudRain, AlertTriangle, CheckCircle2, Timer, ArrowLeft, Zap } from "lucide-react";
import AppNav from "@/components/AppNav";
import { triggerAPI, payoutAPI } from "@/lib/api";

const SimulationPage = () => {
  const navigate = useNavigate();
  const [triggered, setTriggered] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [payout, setPayout] = useState<any>(null);
  const [error, setError] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("heavy_rain");

  const events = [
    { id: "heavy_rain", label: "Heavy Rain", icon: "🌧️", rainfall: 22, duration: 3 },
    { id: "flood", label: "Flood Alert", icon: "🌊", rainfall: 35, duration: 4 },
    { id: "hail", label: "Hailstorm", icon: "⛈️", rainfall: 18, duration: 2 },
    { id: "curfew", label: "Curfew", icon: "🚨", rainfall: 0, duration: 5 },
  ];

  const eventConfig = events.find(e => e.id === selectedEvent) || events[0];

  const runSimulation = async () => {
    setSimulating(true);
    setTriggered(false);
    setPayout(null);
    setError("");

    try {
      // Simulate delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const workerId = localStorage.getItem("workerId");
      if (!workerId) {
        setError("Worker not found");
        setSimulating(false);
        return;
      }

      // Trigger weather event
      await triggerAPI.triggerWeather({
        workerId,
        eventType: selectedEvent,
        severity: eventConfig.rainfall > 25 ? "severe" : "moderate"
      });

      // Create payout
      const payoutResult = await payoutAPI.create({
        workerId,
        reason: eventConfig.label,
        hoursLost: eventConfig.duration,
        disruptionType: selectedEvent
      });

      setTriggered(true);
      setPayout(payoutResult.payout);
    } catch (err) {
      console.error("Simulation error:", err);
      setError("Failed to process simulation");
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <AppNav />
      
      <div className="container py-6 max-w-2xl space-y-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-warning/5 to-warning/0 border border-warning/20 rounded-xl p-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="h-12 w-12 mx-auto mb-3 rounded-full bg-warning/10 flex items-center justify-center"
          >
            <Zap className="h-6 w-6 text-warning" />
          </motion.div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground mb-1">Disruption Simulator</h1>
          <p className="text-sm text-muted-foreground">Test the parametric trigger system and see payouts in action</p>
        </motion.div>

        {/* Event Selection */}
        {!triggered && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-3"
          >
            <p className="text-sm font-medium text-foreground px-1">Select Disruption Type</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {events.map((event) => (
                <motion.button
                  key={event.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedEvent(event.id)}
                  disabled={simulating}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedEvent === event.id
                      ? "border-primary bg-primary/10"
                      : "border-border bg-card/50 hover:border-primary/50"
                  } disabled:opacity-50`}
                >
                  <div className="text-2xl mb-1">{event.icon}</div>
                  <p className="text-xs font-medium text-foreground">{event.label}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive mb-4"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={runSimulation}
            disabled={simulating || triggered}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full py-4 bg-warning text-warning-foreground font-semibold rounded-lg shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_2px_4px_rgba(0,0,0,0.1)] hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {simulating ? (
              <>
                <div className="h-4 w-4 border-2 border-warning-foreground border-t-transparent rounded-full animate-spin" />
                Simulating...
              </>
            ) : triggered ? (
              <>Reset Simulation</>
            ) : (
              <>
                <CloudRain className="h-4 w-4" />
                Simulate {eventConfig.label} Event
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Simulation Progress */}
        <AnimatePresence>
          {simulating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center"
                >
                  <Timer className="h-5 w-5 text-warning" />
                </motion.div>
                <div>
                  <p className="font-medium text-foreground">Analyzing conditions...</p>
                  <p className="text-sm text-muted-foreground">Checking rainfall threshold</p>
                </div>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
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
          {triggered && payout && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* Disruption Detected */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-destructive/5 border border-destructive/20 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Disruption Detected! ⚠️</p>
                    <p className="text-sm text-muted-foreground">{eventConfig.label} event triggered</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-card/50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Rainfall</p>
                    <p className="font-data text-lg font-semibold text-foreground">{eventConfig.rainfall}mm/hr</p>
                  </div>
                  <div className="p-3 bg-card/50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Duration</p>
                    <p className="font-data text-lg font-semibold text-foreground">{eventConfig.duration}h</p>
                  </div>
                </div>
              </motion.div>

              {/* Payout Result */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-success/5 border border-success/20 rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Payout Triggered! ✓</p>
                    <p className="text-sm text-muted-foreground">Automatic compensation applied</p>
                  </div>
                </div>
                <div className="p-4 bg-card/50 rounded-lg text-center">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Amount Credited</p>
                  <p className="font-data text-4xl font-bold text-success">₹{payout.amount.toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground mt-2">Status: {payout.status}</p>
                </div>
              </motion.div>

              {/* Reset Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setTriggered(false)}
                className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:brightness-110 transition-all"
              >
                Run Another Simulation
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="p-4 rounded-lg bg-primary/5 border border-primary/20"
        >
          <p className="text-sm text-foreground font-medium mb-2">How the Simulator Works</p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• Select a disruption type (rain, flood, curfew, etc.)</li>
            <li>• System simulates conditions and triggers automatic payout</li>
            <li>• Payout calculated based on disruption duration × hourly rate</li>
            <li>• Check the Payout page to see your simulation history</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default SimulationPage;
