import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CloudRain, Waves, ShieldAlert, Wifi, Package, CheckCircle2, AlertTriangle, LogOut } from "lucide-react";
import AppNav from "@/components/AppNav";
import StatusCard from "@/components/StatusCard";
import { workerAPI, insuranceAPI } from "@/lib/api";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [worker, setWorker] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const workerId = localStorage.getItem("workerId");
      if (!workerId) {
        navigate("/register");
        return;
      }

      // Fetch worker data
      const workerData = await workerAPI.getWorker(workerId);
      setWorker(workerData);

      // Fetch subscription data
      const subscriptionData = await insuranceAPI.getSubscription(workerId);
      const savedInsurance = localStorage.getItem("insurance");
      if (savedInsurance) {
        const insuranceData = JSON.parse(savedInsurance);
        if (insuranceData.workerId === workerId && insuranceData.isActive) {
          setSubscription({
            id: "local-sub",
            workerId,
            active: true,
            weeklyPremium: insuranceData.premium,
            coverageAmount: insuranceData.coverage,
            riskScore: 45,
            startDate: insuranceData.activatedAt || new Date().toISOString(),
            status: "active"
          });
        } else {
          setSubscription(subscriptionData);
        }
      } else {
        setSubscription(subscriptionData);
      }

    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  useEffect(() => {
    const handleFocus = () => fetchData();
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handleFocus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("workerId");
    localStorage.removeItem("workerData");
    navigate("/", { replace: true });
  };

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
        <button
          onClick={() => navigate("/register")}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:brightness-110"
        >
          Create Profile
        </button>
      </div>
    );
  }

  const riskScore = subscription?.riskScore || 45;
  const weeklyPremium = subscription?.weeklyPremium || Math.round(worker.avgHourlyIncome * 60 * 0.05);
  const coverageAmount = subscription?.coverageAmount || 0;
  const isSubscribed = subscription?.active || false;

  const mockConditions = {
    rainfall: { status: 'clear', mm: 0 },
    floodAlert: false,
    curfew: false,
  };

  const mockActivity = {
    online: true,
    ordersAccepted: 12,
    ordersCompleted: 10,
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      
      <div className="container py-6 space-y-6 pb-20">
        {/* Profile + Status */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-primary/5 to-primary/0 border border-primary/10 rounded-xl p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <motion.h1 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-medium tracking-tight text-foreground"
              >
                {worker.name}
              </motion.h1>
              <p className="text-sm text-muted-foreground mt-1">
                {worker.platform} · {worker.city} · {worker.workingHours}
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2"
            >
              {isSubscribed ? (
                <>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-success/10 text-success text-sm font-medium border border-success/20">
                    <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                    Active Coverage
                  </span>
                  <button
                    onClick={() => navigate("/claim")}
                    className="ml-2 px-3 py-2 rounded-md bg-primary text-white text-sm font-semibold hover:brightness-110 transition-all"
                  >
                    Continue to Claim
                  </button>
                </>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-warning/10 text-warning text-sm font-medium border border-warning/20">
                  No Coverage
                </span>
              )}
            </motion.div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Premium</p>
              <p className="font-data text-lg font-semibold text-foreground mt-1">₹{weeklyPremium}</p>
              <p className="text-xs text-muted-foreground">/week</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Hourly</p>
              <p className="font-data text-lg font-semibold text-foreground mt-1">₹{worker.avgHourlyIncome}</p>
              <p className="text-xs text-muted-foreground">/hour</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Risk Score</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${riskScore}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className={`h-full rounded-full transition-colors ${
                        riskScore > 70 ? 'bg-destructive' : riskScore > 40 ? 'bg-warning' : 'bg-success'
                      }`}
                    />
                  </div>
                </div>
                <p className="font-data text-lg font-semibold text-foreground min-w-fit">{riskScore}%</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="col-span-2 p-4 rounded-lg bg-gradient-to-r from-success/10 to-emerald/5 border border-success/20"
            >
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Coverage</p>
              <p className="font-data text-xl font-bold text-success mb-1">₹{coverageAmount.toLocaleString()}</p>
              <p className="text-xs text-success/80 font-medium">Max payout per claim</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Current Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3 px-1">Current Conditions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatusCard
              label="Rainfall"
              value={mockConditions.rainfall.status === 'clear' ? 'Clear' : `${mockConditions.rainfall.mm}mm/hr`}
              status={mockConditions.rainfall.status === 'heavy' ? 'alert' : 'success'}
              icon={<CloudRain className="h-4 w-4" />}
            />
            <StatusCard
              label="Flood Alert"
              value={mockConditions.floodAlert ? 'Warning' : 'Safe'}
              status={mockConditions.floodAlert ? 'alert' : 'success'}
              icon={<Waves className="h-4 w-4" />}
            />
            <StatusCard
              label="Curfew"
              value={mockConditions.curfew ? 'Active' : 'None'}
              status={mockConditions.curfew ? 'alert' : 'neutral'}
              icon={<ShieldAlert className="h-4 w-4" />}
            />
          </div>
        </motion.div>

        {/* Worker Activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3 px-1">Activity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatusCard
              label="Status"
              value={mockActivity.online ? 'Online' : 'Offline'}
              status={mockActivity.online ? 'success' : 'neutral'}
              icon={<Wifi className="h-4 w-4" />}
            />
            <StatusCard
              label="Orders Accepted"
              value={String(mockActivity.ordersAccepted)}
              status="neutral"
              icon={<Package className="h-4 w-4" />}
            />
            <StatusCard
              label="Completed"
              value={String(mockActivity.ordersCompleted)}
              status="success"
              icon={<CheckCircle2 className="h-4 w-4" />}
            />
          </div>
        </motion.div>

        {/* Trigger Status */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3 px-1">Coverage Status</h2>
          <div className={`rounded-xl p-5 border ${isSubscribed ? 'bg-success/5 border-success/20' : 'bg-warning/5 border-warning/20'}`}>
            <div className="flex items-start gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${isSubscribed ? 'bg-success/10' : 'bg-warning/10'}`}>
                {isSubscribed ? (
                  <CheckCircle2 className={`h-5 w-5 ${isSubscribed ? 'text-success' : 'text-warning'}`} />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-warning" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {isSubscribed ? 'Coverage Active' : 'No Active Coverage'}
                </p>
                {isSubscribed ? (
                  <div className="text-xs space-y-1 mt-2 p-2 bg-card rounded border">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Premium</span>
                      <span>₹{weeklyPremium}/wk</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-success">
                      <span>Coverage</span>
                      <span>₹{coverageAmount.toLocaleString()}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    Subscribe to enable automatic payouts
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4"
        >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchData}
              className="col-span-1 flex items-center gap-2 px-4 py-3 bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground font-medium rounded-lg transition-all"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </motion.button>
          <button
            onClick={() => navigate("/insurance")}
            className="px-4 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:brightness-110 transition-all transform hover:scale-105 active:scale-95"
          >
            {isSubscribed ? 'Manage' : 'Subscribe to'} Insurance ({weeklyPremium}/wk)
          </button>
          <button
            onClick={() => navigate("/payout")}
            className="px-4 py-3 bg-card border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-all"
          >
            View Payouts
          </button>
          <button
            onClick={() => navigate("/claim")}
            className="px-4 py-3 bg-card border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-all"
          >
            File Claim
          </button>
        </motion.div>
      </div>

      {/* Fixed Bottom Navigation */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border p-4"
      >
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
