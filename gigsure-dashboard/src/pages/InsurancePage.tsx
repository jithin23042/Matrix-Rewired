import { motion } from "framer-motion";
import { Shield, CloudRain, MapPin, Clock } from "lucide-react";
import AppNav from "@/components/AppNav";
import { mockInsurance, mockWorker } from "@/lib/mockData";
import { useState } from "react";

const riskBreakdown = [
  { label: "Environmental", value: 45, icon: <CloudRain className="h-4 w-4" /> },
  { label: "Zone Risk", value: 30, icon: <MapPin className="h-4 w-4" /> },
  { label: "Shift Risk", value: 25, icon: <Clock className="h-4 w-4" /> },
];

const InsurancePage = () => {
  const [subscribed, setSubscribed] = useState(mockInsurance.active);

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
          <Shield className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-medium tracking-tight text-foreground mb-1">Weekly Protection Plan</h1>
          <p className="text-sm text-muted-foreground mb-6">Coverage for {mockWorker.name} · {mockWorker.city}</p>

          <div className="bg-background rounded-lg p-5 mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Weekly Premium</p>
            <p className="font-data text-4xl font-bold text-foreground">₹{mockInsurance.weeklyPremium}<span className="text-lg text-muted-foreground font-sans">/wk</span></p>
            <p className="text-xs text-muted-foreground mt-2">Based on ₹{mockWorker.avgHourlyEarnings}/hr average earnings</p>
          </div>

          {subscribed ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-success/10 text-success font-medium text-sm">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />
              Coverage Active
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setSubscribed(true)}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-md shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_2px_4px_rgba(0,0,0,0.1)] hover:brightness-110 transition-all"
            >
              Subscribe for Weekly Plan
            </motion.button>
          )}
        </motion.div>

        {/* Risk Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.2, 0, 0, 1] }}
        >
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3">Risk Breakdown</h2>
          <div className="bg-card rounded-xl shadow-card p-5 space-y-4">
            {riskBreakdown.map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                    <span className="text-muted-foreground">{r.icon}</span>
                    {r.label}
                  </div>
                  <span className="font-data text-sm text-muted-foreground">{r.value}%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${r.value}%` }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InsurancePage;
