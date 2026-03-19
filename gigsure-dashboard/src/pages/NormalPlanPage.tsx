import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, CloudRain, MapPin, Clock, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AppNav from "@/components/AppNav";

const NormalPlanPage = () => {
  const [plan, setPlan] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [customPremium, setCustomPremium] = useState(35);
  const [coverageAmount, setCoverageAmount] = useState(350);

  useEffect(() => {
    const fetchData = async () => {
      const workerId = localStorage.getItem("workerId");
      let planData = null;
      
      try {
        // Fetch plan details
        const planResponse = await fetch("http://localhost:5000/insurance/normal");
        if (planResponse.ok) {
          planData = await planResponse.json();
          setPlan(planData);
          setCustomPremium(planData.weeklyPremium);
          setCoverageAmount(planData.weeklyPremium * 8);
        }

        // Check if user is already subscribed to this plan
        if (workerId) {
          const statusResponse = await fetch(`http://localhost:5000/payout/status/${workerId}`);
          if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            setCurrentPlan(statusData.insurancePlan);
            if (statusData.insuranceActive && statusData.insurancePlan === 'normal') {
              setSubscribed(true);
              setCustomPremium(statusData.customPremium || planData?.weeklyPremium);
              setCoverageAmount(statusData.coverageAmount || (planData?.weeklyPremium * 8));
            }
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const handlePremiumChange = async (value: number) => {
    setCustomPremium(value);

    // Calculate coverage using the backend calculator
    const workerId = localStorage.getItem("workerId");
    if (workerId) {
      try {
        const response = await fetch("http://localhost:5000/insurance/calculate-coverage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            premium: value,
            workerId: workerId,
            planType: "normal"
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setCoverageAmount(data.coverageAmount);
        } else {
          // Fallback to simple calculation if API fails
          setCoverageAmount(value * 8);
        }
      } catch (error) {
        console.error("Error calculating coverage:", error);
        // Fallback to simple calculation
        setCoverageAmount(value * 8);
      }
    } else {
      // Fallback if no worker ID
      setCoverageAmount(value * 8);
    }
  };

  const handleSubscribe = async () => {
    const workerId = localStorage.getItem("workerId");
    if (!workerId) {
      alert("Please register first");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/insurance/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          workerId: workerId,
          planId: "normal",
          customPremium: customPremium,
          coverageAmount: coverageAmount
        })
      });

      if (response.ok) {
        setSubscribed(true);
        alert("Successfully subscribed to Normal Plan!");
        // Redirect to dashboard after successful subscription
  setTimeout(() => {
          window.location.href = '/insurance';
        }, 1000);
      } else {
        alert("Failed to subscribe");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to subscribe");
    }
  };

  if (!plan) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <div className="container py-6 max-w-lg space-y-6">
        <Link to="/insurance" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Insurance Plans
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0, 1] }}
          className="bg-card rounded-xl shadow-card p-6 text-center"
        >
          <Shield className="h-10 w-10 text-primary mx-auto mb-3" />
          <h1 className="text-2xl font-medium tracking-tight text-foreground mb-1">{plan.name}</h1>
          <p className="text-sm text-muted-foreground mb-6">{plan.coverage}</p>

          <div className="bg-background rounded-lg p-5 mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Weekly Premium</p>
            <p className="font-data text-4xl font-bold text-foreground">₹{customPremium}<span className="text-lg text-muted-foreground font-sans">/wk</span></p>
            
            {/* Premium Adjustment Slider */}
            <div className="mt-4">
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">Adjust Premium</label>
              <input
                type="range"
                min="20"
                max="100"
                value={customPremium}
                onChange={(e) => handlePremiumChange(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>₹20</span>
                <span>₹100</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg p-5 mb-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Coverage Amount</p>
            <p className="font-data text-3xl font-bold text-foreground">₹{coverageAmount}<span className="text-lg text-muted-foreground font-sans">/week</span></p>
            <p className="text-xs text-muted-foreground mt-2">Maximum payout per disruption event</p>
          </div>

          <div className="text-left mb-6">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3">Plan Features</h3>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {subscribed ? (
            <Link to="/insurance" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-success/10 text-success font-medium text-sm hover:bg-success/20 transition-colors">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse-dot" />
              Change Plans
            </Link>
          ) : currentPlan ? (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSubscribe}
              className="w-full py-3 bg-orange-600 text-white font-semibold rounded-md shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_2px_4px_rgba(0,0,0,0.1)] hover:bg-orange-700 transition-all"
            >
              Switch to Normal Plan
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSubscribe}
              className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-md shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_2px_4px_rgba(0,0,0,0.1)] hover:brightness-110 transition-all"
            >
              Subscribe to Normal Plan
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default NormalPlanPage;