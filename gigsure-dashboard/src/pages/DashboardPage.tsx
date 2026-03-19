import { motion } from "framer-motion";
import { CloudRain, Waves, ShieldAlert, Wifi, Package, CheckCircle2, AlertTriangle, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import StatusCard from "@/components/StatusCard";
import AppNav from "@/components/AppNav";
import { mockWorker, mockInsurance, mockConditions, mockActivity } from "@/lib/mockData";

const DashboardPage = () => {
  const [insuranceStatus, setInsuranceStatus] = useState(null);
  const [workerData, setWorkerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const workerId = localStorage.getItem("workerId");
      
      if (workerId) {
        try {
          // Fetch worker data
          const workerResponse = await fetch(`http://localhost:5000/worker/${workerId}`);
          if (workerResponse.ok) {
            const worker = await workerResponse.json();
            setWorkerData(worker);
          }

          // Fetch insurance status
          const insuranceResponse = await fetch(`http://localhost:5000/payout/status/${workerId}`);
          if (insuranceResponse.ok) {
            const insurance = await insuranceResponse.json();
            setInsuranceStatus(insurance);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <div className="container py-6 space-y-6">
        {/* Profile + Status */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="bg-card rounded-xl shadow-card p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl font-medium tracking-tight text-foreground">{workerData?.name || mockWorker.name}</h1>
              <p className="text-sm text-muted-foreground">
                {workerData?.platform || mockWorker.platform} · {workerData?.city || mockWorker.city} · {workerData?.workingHours ? workerData.workingHours.replace('-', ' – ') : `${mockWorker.workingHoursStart} – ${mockWorker.workingHoursEnd}`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {insuranceStatus?.insuranceActive ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-success/10 text-success text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-muted/10 text-muted-foreground text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-muted" />
                  No Plan
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-background">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Amount</p>
              <p className="font-data text-lg font-semibold text-foreground">
                ₹{insuranceStatus?.customPremium || mockInsurance.weeklyPremium}
                <span className="text-xs text-muted-foreground font-sans">/wk</span>
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Earnings</p>
              <p className="font-data text-lg font-semibold text-foreground">₹{workerData?.avgHourlyIncome || mockWorker.avgHourlyEarnings}<span className="text-xs text-muted-foreground font-sans">/hr</span></p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Payouts</p>
              <p className="font-data text-lg font-semibold text-foreground">{insuranceStatus?.totalPayouts || 0}</p>
            </div>
          </div>
        </motion.div>

        {/* Current Insurance Plan */}
        {insuranceStatus?.insuranceActive && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: [0.2, 0, 0, 1] }}
            className="bg-card rounded-xl shadow-card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Current Plan</h2>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-success/10 text-success text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />
                  Active
                </span>
                <Link 
                  to="/insurance"
                  className="text-xs px-2 py-1 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors"
                >
                  Change Plan
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-background">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Plan Type</p>
                <p className="font-data text-lg font-semibold text-foreground capitalize">{insuranceStatus.insurancePlan}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Coverage Amount</p>
                <p className="font-data text-lg font-semibold text-foreground">₹{insuranceStatus?.coverageAmount || workerData?.coverageAmount || 0}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Payouts Count</p>
                <p className="font-data text-lg font-semibold text-foreground">{insuranceStatus.totalPayouts || 0}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Payout Amount</p>
                <p className="font-data text-lg font-semibold text-success">₹{insuranceStatus.totalPayoutAmount || 0}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Insurance Plans */}
        <motion.div
          id="insurance-plans"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.2, 0, 0, 1] }}
        >
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3">Insurance Plans</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link to="/insurance" className="bg-card rounded-xl shadow-card p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Normal</p>
                  <p className="text-xs text-muted-foreground">₹35/week</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Basic weather protection</p>
            </Link>

            <Link to="/insurance" className="bg-card rounded-xl shadow-card p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Basic</p>
                  <p className="text-xs text-muted-foreground">₹45/week</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Standard protection</p>
            </Link>

            <Link to="/insurance" className="bg-card rounded-xl shadow-card p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Premium</p>
                  <p className="text-xs text-muted-foreground">₹65/week</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Complete protection</p>
            </Link>
          </div>
        </motion.div>

        {/* Current Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.2, 0, 0, 1] }}
        >
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3">Current Conditions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatusCard
              label="Rainfall"
              value={mockConditions.rainfall.status === 'clear' ? 'Clear Skies' : `${mockConditions.rainfall.mm}mm/hr`}
              status={mockConditions.rainfall.status === 'heavy' ? 'alert' : 'success'}
              icon={<CloudRain className="h-3.5 w-3.5" />}
            />
            <StatusCard
              label="Flood Alert"
              value={mockConditions.floodAlert ? 'Warning Active' : 'No Alerts'}
              status={mockConditions.floodAlert ? 'alert' : 'success'}
              icon={<Waves className="h-3.5 w-3.5" />}
            />
            <StatusCard
              label="Curfew"
              value={mockConditions.curfew ? 'Curfew Active' : 'None'}
              status={mockConditions.curfew ? 'alert' : 'neutral'}
              icon={<ShieldAlert className="h-3.5 w-3.5" />}
            />
          </div>
        </motion.div>

        {/* Worker Activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.2, 0, 0, 1] }}
        >
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3">Worker Activity</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatusCard
              label="Status"
              value={mockActivity.online ? 'Online' : 'Offline'}
              status={mockActivity.online ? 'success' : 'neutral'}
              icon={<Wifi className="h-3.5 w-3.5" />}
            />
            <StatusCard
              label="Orders Accepted"
              value={String(mockActivity.ordersAccepted)}
              status="neutral"
              icon={<Package className="h-3.5 w-3.5" />}
            />
            <StatusCard
              label="Completed"
              value={String(mockActivity.ordersCompleted)}
              status="success"
              icon={<CheckCircle2 className="h-3.5 w-3.5" />}
            />
          </div>
        </motion.div>

        {/* Trigger Status */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4, ease: [0.2, 0, 0, 1] }}
        >
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3">Trigger Status</h2>
          <div className="bg-card rounded-xl shadow-card p-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">No Disruption Detected</p>
                <p className="text-sm text-muted-foreground">All conditions are within normal parameters</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default DashboardPage;
