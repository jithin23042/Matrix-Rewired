import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, CloudRain, MapPin, Clock, CheckCircle2, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AppNav from "@/components/AppNav";
import { mockInsurance, mockWorker } from "@/lib/mockData";

const riskBreakdown = [
  { label: "Environmental", value: 45, icon: <CloudRain className="h-4 w-4" /> },
  { label: "Zone Risk", value: 30, icon: <MapPin className="h-4 w-4" /> },
  { label: "Shift Risk", value: 25, icon: <Clock className="h-4 w-4" /> },
];

const InsurancePage = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [workerData, setWorkerData] = useState(null);
  const [insuranceStatus, setInsuranceStatus] = useState(null);
  const [loading, setLoading] = useState(true);

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

        // Fetch insurance status
        const statusResponse = await fetch(`http://localhost:5000/payout/status/${workerId}`);
        if (statusResponse.ok) {
          const status = await statusResponse.json();
          setInsuranceStatus(status);
        }

        // Fetch insurance plans
        const plansResponse = await fetch("http://localhost:5000/insurance");
        if (plansResponse.ok) {
          const plansData = await plansResponse.json();
          setPlans(plansData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppNav />
        <div className="container py-6 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading insurance plans...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <div className="container py-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="text-center"
        >
          <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-medium tracking-tight text-foreground mb-2">Insurance Plans</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Choose the perfect protection plan for {workerData?.name || "your"} work in {workerData?.city || "your city"}
          </p>
        </motion.div>

        {/* Current Plan Status */}
        {insuranceStatus?.insuranceActive && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: [0.2, 0, 0, 1] }}
            className="bg-card rounded-xl shadow-card p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-foreground">Current Plan</h2>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-success/10 text-success text-sm font-medium">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />
                Active
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-background">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Plan Type</p>
                <p className="font-data text-lg font-semibold text-foreground capitalize">{insuranceStatus.insurancePlan}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Weekly Premium</p>
                <p className="font-data text-lg font-semibold text-foreground">₹{insuranceStatus.customPremium}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Coverage Amount</p>
                <p className="font-data text-lg font-semibold text-foreground">₹{insuranceStatus.coverageAmount}</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-background">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Payouts</p>
                <p className="font-data text-lg font-semibold text-foreground">{insuranceStatus.totalPayouts || 0}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Available Plans */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.2, 0, 0, 1] }}
        >
          <h2 className="text-lg font-medium text-foreground mb-4">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index, ease: [0.2, 0, 0, 1] }}
                className={`bg-card rounded-xl shadow-card p-5 hover:shadow-lg transition-all ${
                  insuranceStatus?.insurancePlan === plan.id ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    plan.id === 'normal' ? 'bg-blue-100' :
                    plan.id === 'basic' ? 'bg-green-100' : 'bg-purple-100'
                  }`}>
                    <Shield className={`h-5 w-5 ${
                      plan.id === 'normal' ? 'text-blue-600' :
                      plan.id === 'basic' ? 'text-green-600' : 'text-purple-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground capitalize">{plan.name}</h3>
                    {insuranceStatus?.insurancePlan === plan.id && (
                      <span className="text-xs text-success font-medium">Current Plan</span>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="font-data text-2xl font-bold text-foreground">₹{plan.weeklyPremium}</span>
                    <span className="text-sm text-muted-foreground">/week</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.coverage}</p>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Features</p>
                  <ul className="space-y-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle2 className="h-3 w-3 text-success" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={`/plans/${plan.id}`}
                  className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-all ${
                    insuranceStatus?.insurancePlan === plan.id
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                  onClick={(e) => {
                    if (insuranceStatus?.insurancePlan === plan.id) {
                      e.preventDefault();
                    }
                  }}
                >
                  {insuranceStatus?.insurancePlan === plan.id ? 'Current Plan' : 'View Details'}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Risk Assessment */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.2, 0, 0, 1] }}
          className="bg-card rounded-xl shadow-card p-5"
        >
          <h2 className="text-lg font-medium text-foreground mb-4">Risk Assessment</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {riskBreakdown.map((risk, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-muted-foreground">{risk.icon}</span>
                  <span className="text-sm font-medium text-foreground">{risk.label}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${risk.value}%` }}
                    transition={{ duration: 0.8, delay: 0.2 * index }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
                <p className="text-sm font-semibold text-foreground">{risk.value}%</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InsurancePage;
