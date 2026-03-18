import { motion } from "framer-motion";
import { CloudRain, Waves, ShieldAlert, Wifi, Package, CheckCircle2, AlertTriangle } from "lucide-react";
import StatusCard from "@/components/StatusCard";
import AppNav from "@/components/AppNav";
import { mockWorker, mockInsurance, mockConditions, mockActivity } from "@/lib/mockData";

const DashboardPage = () => {
  const riskPercent = mockInsurance.riskScore;

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
              <h1 className="text-xl font-medium tracking-tight text-foreground">{mockWorker.name}</h1>
              <p className="text-sm text-muted-foreground">{mockWorker.platform} · {mockWorker.city} · {mockWorker.workingHoursStart}–{mockWorker.workingHoursEnd}</p>
            </div>
            <div className="flex items-center gap-3">
              {mockInsurance.active ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-success/10 text-success text-sm font-medium">
                  <span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-destructive/10 text-destructive text-sm font-medium">
                  Inactive
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-lg bg-background">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Premium</p>
              <p className="font-data text-lg font-semibold text-foreground">₹{mockInsurance.weeklyPremium}<span className="text-xs text-muted-foreground font-sans">/wk</span></p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Avg Earnings</p>
              <p className="font-data text-lg font-semibold text-foreground">₹{mockWorker.avgHourlyEarnings}<span className="text-xs text-muted-foreground font-sans">/hr</span></p>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3 rounded-lg bg-background">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 text-center">Risk Score</p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${riskPercent}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className={`h-full rounded-full ${riskPercent > 70 ? 'bg-destructive' : riskPercent > 40 ? 'bg-warning' : 'bg-success'}`}
                />
              </div>
              <p className="font-data text-sm font-semibold text-center mt-1 text-foreground">{riskPercent}%</p>
            </div>
          </div>
        </motion.div>

        {/* Current Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.2, 0, 0, 1] }}
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
          transition={{ duration: 0.4, delay: 0.2, ease: [0.2, 0, 0, 1] }}
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
          transition={{ duration: 0.4, delay: 0.3, ease: [0.2, 0, 0, 1] }}
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
