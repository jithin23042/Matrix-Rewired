import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Wallet, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppNav from "@/components/AppNav";
import { mockPayouts, mockWorker } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const PayoutPage = () => {
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);
  const [payoutHistory, setPayoutHistory] = useState([]);
  const [workerData, setWorkerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const incomeLoss = 450;

  useEffect(() => {
    const fetchData = async () => {
      const workerId = localStorage.getItem("workerId");
      if (!workerId) {
        navigate("/register");
        return;
      }

      try {
        // Fetch worker data
        const workerResponse = await fetch(`http://localhost:5000/worker/${workerId}`);
        if (workerResponse.ok) {
          const worker = await workerResponse.json();
          setWorkerData(worker);
        }

        // Fetch payout history
        const payoutsResponse = await fetch(`http://localhost:5000/payout/${workerId}`);
        if (payoutsResponse.ok) {
          const payouts = await payoutsResponse.json();
          setPayoutHistory(payouts);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const processPayout = async () => {
    const workerId = localStorage.getItem("workerId");
    if (!workerId) {
      navigate("/register");
      return;
    }

    setProcessing(true);
    
    try {
      const response = await fetch("http://localhost:5000/payout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workerId,
          amount: incomeLoss,
          reason: "Weather disruption - Heavy rainfall"
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setPaid(true);
        
        // Refresh payout history
        const payoutsResponse = await fetch(`http://localhost:5000/payout/${workerId}`);
        if (payoutsResponse.ok) {
          const payouts = await payoutsResponse.json();
          setPayoutHistory(payouts);
        }
      } else {
        const error = await response.json();
        alert(error.message || "Failed to process payout");
      }
    } catch (error) {
      console.error("Error processing payout:", error);
      alert("Failed to process payout. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <div className="container py-6 max-w-2xl space-y-6">
        {/* Current Payout */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="bg-card rounded-xl shadow-card p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <Wallet className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-medium tracking-tight text-foreground">Payout</h1>
          </div>

          <div className="bg-background rounded-lg p-5 text-center mb-5">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Calculated Income Loss</p>
            <p className="font-data text-4xl font-bold text-foreground">₹{incomeLoss.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Based on {workerData?.avgHourlyIncome || mockWorker.avgHourlyEarnings}/hr × 3h disruption</p>
          </div>

          {paid ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-3 p-4 bg-success/10 rounded-lg"
            >
              <CheckCircle2 className="h-6 w-6 text-success" />
              <div>
                <p className="font-semibold text-foreground">Payout Successful</p>
                <p className="text-sm text-muted-foreground">₹{incomeLoss.toFixed(2)} has been credited to your wallet</p>
              </div>
            </motion.div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={processPayout}
              disabled={processing}
              className="w-full py-4 bg-success text-success-foreground font-bold rounded-xl shadow-[0_4px_12px_rgba(16,185,129,0.25)] hover:brightness-110 transition-all disabled:opacity-50"
            >
              {processing ? "Processing..." : "Process Payout"}
            </motion.button>
          )}
        </motion.div>

        {/* History */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.2, 0, 0, 1] }}
        >
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3">Payout History</h2>
          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Event</th>
                    <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Duration</th>
                    <th className="text-right px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Amount</th>
                    <th className="text-right px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        Loading payout history...
                      </td>
                    </tr>
                  ) : payoutHistory.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No payout history yet
                      </td>
                    </tr>
                  ) : (
                    payoutHistory.map((p) => (
                      <tr key={p.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 font-data text-foreground">
                          {new Date(p.date).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-4 py-3 text-foreground">{p.reason}</td>
                        <td className="px-4 py-3 font-data text-muted-foreground">-</td>
                        <td className="px-4 py-3 font-data text-right font-semibold text-success">+₹{p.amount.toFixed(2)}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={cn(
                            "inline-block px-2 py-0.5 text-xs font-medium rounded",
                            p.status === 'processed' && "bg-success/10 text-success",
                            p.status === 'pending' && "bg-warning/10 text-warning",
                            p.status === 'processing' && "bg-primary/10 text-primary",
                          )}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PayoutPage;
