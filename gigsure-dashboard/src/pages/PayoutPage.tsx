import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Wallet, CheckCircle2, ArrowLeft, FileText, Clock } from "lucide-react";
import AppNav from "@/components/AppNav";
import { workerAPI, payoutAPI } from "@/lib/api";
import { cn } from "@/lib/utils";

const PayoutPage = () => {
  const navigate = useNavigate();
  const [worker, setWorker] = useState<any>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workerId = localStorage.getItem("workerId");
        if (!workerId) {
          navigate("/register");
          return;
        }

        const workerData = await workerAPI.getWorker(workerId);
        setWorker(workerData);

        const payoutsData = await payoutAPI.getWorkerPayouts(workerId);
        setPayouts(payoutsData);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load payout data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error || "No worker data found"}</p>
      </div>
    );
  }

  const totalPayouts = payouts.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-background pb-6">
      <AppNav />
      
      <div className="container py-6 max-w-4xl space-y-6">
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-xl p-6 bg-gradient-to-br from-success/5 to-success/0 border border-success/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Wallet className="h-5 w-5 text-success" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Total Received</p>
            </div>
            <p className="font-data text-3xl font-bold text-foreground">₹{totalPayouts.toFixed(0)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="rounded-xl p-6 bg-gradient-to-br from-primary/5 to-primary/0 border border-primary/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Total Payouts</p>
            </div>
            <p className="font-data text-3xl font-bold text-foreground">{payouts.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-xl p-6 bg-gradient-to-br from-warning/5 to-warning/0 border border-warning/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <p className="text-sm text-muted-foreground font-medium">Avg Payout</p>
            </div>
            <p className="font-data text-3xl font-bold text-foreground">
              ₹{payouts.length > 0 ? (totalPayouts / payouts.length).toFixed(0) : "0"}
            </p>
          </motion.div>
        </div>

        {/* Payout History */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3 px-1">Payout History</h2>
          
          {payouts.length === 0 ? (
            <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-foreground font-medium">No payouts yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                When a weather disruption triggers a payout, it will appear here
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left px-4 py-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
                      <th className="text-left px-4 py-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Reason</th>
                      <th className="text-left px-4 py-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Duration</th>
                      <th className="text-right px-4 py-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Amount</th>
                      <th className="text-right px-4 py-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payouts.map((payout, i) => (
                      <motion.tr 
                        key={payout.id} 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className="border-b border-border/50 last:border-0 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-4 py-4 font-data text-foreground">
                          {new Date(payout.dateTriggered).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 text-foreground capitalize">{payout.reason}</td>
                        <td className="px-4 py-4 font-data text-muted-foreground">{payout.hoursLost}h</td>
                        <td className="px-4 py-4 font-data text-right font-semibold text-success">+₹{payout.amount.toFixed(2)}</td>
                        <td className="px-4 py-4 text-right">
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 + i * 0.05 }}
                            className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full",
                              payout.status === 'processed' && "bg-success/10 text-success border border-success/20",
                              payout.status === 'pending' && "bg-warning/10 text-warning border border-warning/20",
                            )}
                          >
                            {payout.status === 'processed' && <CheckCircle2 className="h-3 w-3" />}
                            {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                          </motion.span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="p-4 rounded-lg bg-primary/5 border border-primary/20"
        >
          <p className="text-sm text-foreground font-medium">How Payouts Work</p>
          <ul className="text-sm text-muted-foreground mt-2 space-y-1 ml-4">
            <li>• Payouts are automatically triggered when weather disruptions occur</li>
            <li>• Calculated as: Your hourly rate × hours of disruption</li>
            <li>• Requires active insurance subscription</li>
            <li>• Credited to your wallet within minutes</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default PayoutPage;
