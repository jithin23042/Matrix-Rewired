import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, CloudRain, MapPin, Clock, ArrowLeft, Check, DollarSign } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppNav from "@/components/AppNav";
import { workerAPI, insuranceAPI } from "@/lib/api";

const riskBreakdown = [
  { label: "Environmental", value: 45, icon: <CloudRain className="h-4 w-4" /> },
  { label: "Zone Risk", value: 30, icon: <MapPin className="h-4 w-4" /> },
  { label: "Shift Risk", value: 25, icon: <Clock className="h-4 w-4" /> },
];

const InsurancePage = () => {
  const navigate = useNavigate();
  const [worker, setWorker] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState("");
  const [userWeeklyAmount, setUserWeeklyAmount] = useState(100);
  const [coveragePreview, setCoveragePreview] = useState(2000);

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

        const subscriptionData = await insuranceAPI.getSubscription(workerId);
        setSubscription(subscriptionData);

        // Set default amount based on worker earnings
        const defaultPremium = Math.round(workerData.avgHourlyIncome * 60 * 0.05);
        const userAmount = defaultPremium >= 50 ? defaultPremium : 100;
        setUserWeeklyAmount(userAmount);
        setCoveragePreview(userAmount * 20);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load insurance data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAmountChange = (value: number[]) => {
    const amount = Math.max(50, Math.min(1000, Math.round(value[0])));
    setUserWeeklyAmount(amount);
    setCoveragePreview(amount * 20);
  };

  const handleSubscribe = async () => {
    setSubscribing(true);
    try {
      const workerId = localStorage.getItem("workerId");
      const result = await insuranceAPI.subscribe(workerId!, userWeeklyAmount);
      setSubscription(result.subscription);
    } catch (err) {
      console.error("Subscription error:", err);
      setError("Failed to subscribe");
    } finally {
      setSubscribing(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel coverage?")) return;
    
    try {
      const workerId = localStorage.getItem("workerId");
      const result = await insuranceAPI.cancel(workerId!);
      setSubscription(result.subscription);
    } catch (err) {
      console.error("Cancel error:", err);
      setError("Failed to cancel subscription");
    }
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
      </div>
    );
  }

  const isSubscribed = subscription?.active || false;
  const weeklyPremium = subscription?.weeklyPremium || userWeeklyAmount;

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

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`rounded-xl p-8 text-center border-2 transition-all ${
            isSubscribed 
              ? 'bg-success/5 border-success/20' 
              : 'bg-gradient-to-br from-primary/5 to-primary/0 border-primary/20'
          }`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className={`h-14 w-14 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isSubscribed ? 'bg-success/10' : 'bg-primary/10'
            }`}
          >
            <Shield className={`h-7 w-7 ${isSubscribed ? 'text-success' : 'text-primary'}`} />
          </motion.div>

          <h1 className="text-3xl font-medium tracking-tight text-foreground mb-2">
            Weekly Protection Plan
          </h1>
          <p className="text-sm text-muted-foreground mb-8">
            Coverage for {worker.name} • {worker.city}
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive mb-6"
            >
              {error}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card/50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-border/50"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Weekly Premium</p>
            <p className="font-data text-5xl font-bold text-foreground mb-1">₹{weeklyPremium}</p>
            <p className="text-xs text-muted-foreground">per week</p>

            {!isSubscribed && (
              <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <Label className="text-sm font-medium">Choose your premium amount:</Label>
                </div>
                <div className="space-y-3">
                  <Slider 
                    defaultValue={[userWeeklyAmount]} 
                    min={50} 
                    max={1000} 
                    step={10}
                    onValueChange={handleAmountChange}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span>₹50</span>
                    <span className="font-mono font-bold text-foreground">₹{userWeeklyAmount}</span>
                    <span>₹1000</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-success/10 to-emerald/5 rounded-lg p-6 border border-success/20 text-center"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" />
              Coverage Amount
            </p>
            <p className="font-data text-4xl font-bold text-success mb-1">₹{isSubscribed ? subscription.coverageAmount?.toLocaleString() || coveragePreview.toLocaleString() : coveragePreview.toLocaleString()}</p>
            <p className="text-xs text-success/80 font-medium">Max payout per claim (20x premium)</p>
          </motion.div>

          {isSubscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-3"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-success/10 text-success font-medium text-sm border border-success/20">
                <Check className="h-4 w-4" />
                Coverage Active • ₹{weeklyPremium}/week
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleCancel}
                className="w-full py-3 bg-destructive/10 text-destructive font-semibold rounded-md hover:bg-destructive/20 transition-all"
              >
                Cancel Coverage
              </motion.button>
            </motion.div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSubscribe}
              disabled={subscribing || userWeeklyAmount < 50}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-md shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_2px_4px_rgba(0,0,0,0.1)] hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {subscribing ? (
                <>
                  <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Subscribing...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4" />
                  Subscribe ₹{userWeeklyAmount}/week
                </>
              )}
            </motion.button>
          )}
        </motion.div>

        {/* Risk Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3 px-1">Risk Assessment</h2>
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50 space-y-5">
            {riskBreakdown.map((r, i) => (
              <motion.div 
                key={r.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <div className="p-1.5 bg-primary/10 rounded">
                      {r.icon}
                    </div>
                    {r.label}
                  </div>
                  <span className="font-data text-foreground">{r.value}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${r.value}%` }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {[
            { title: "Instant Payouts", desc: "Within minutes, not weeks" },
            { title: "No Paperwork", desc: "Automatic claims processing" },
            { title: "24/7 Protection", desc: "Coverage on all shifts" },
            { title: "Easy Cancellation", desc: "Anytime, no questions asked" },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="p-4 rounded-lg bg-card/50 border border-border/50"
            >
              <p className="font-medium text-foreground text-sm">{feature.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default InsurancePage;
