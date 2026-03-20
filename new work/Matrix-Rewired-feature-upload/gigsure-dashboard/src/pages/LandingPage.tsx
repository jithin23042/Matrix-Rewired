import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, CloudRain, Zap, Wallet } from "lucide-react";

const features = [
  { icon: <CloudRain className="h-5 w-5" />, title: "Event Triggers", desc: "Automatic detection of weather events and curfews" },
  { icon: <Zap className="h-5 w-5" />, title: "Instant Payouts", desc: "Compensation processed within minutes, not weeks" },
  { icon: <Wallet className="h-5 w-5" />, title: "Low Premiums", desc: "Starting at just ₹45/week for full coverage" },
];

const LandingPage = () => (
  <div className="min-h-screen bg-background">
    {/* Hero */}
    <div className="container py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
        className="max-w-2xl mx-auto text-center"
      >
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-medium mb-6">
          <Shield className="h-4 w-4" />
          Parametric Insurance
        </div>
        <h1 className="text-3xl md:text-5xl font-medium tracking-tight text-foreground leading-tight mb-4">
          Rain shouldn't stop your earnings.
        </h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
          Automatic compensation for delivery workers when weather disruptions hit. No claims, no paperwork — just instant payouts.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_2px_4px_rgba(0,0,0,0.1)] hover:brightness-110 transition-all"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center justify-center px-6 py-3 bg-card text-foreground font-medium rounded-md shadow-card hover:bg-muted transition-colors"
          >
            Login
          </Link>
        </div>
      </motion.div>

      {/* Visual */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.2, 0, 0, 1] }}
        className="mt-16 max-w-3xl mx-auto"
      >
        <div className="bg-card rounded-xl shadow-card p-6 md:p-8">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background">
              <CloudRain className="h-8 w-8 text-primary" />
              <span className="text-xs font-medium text-muted-foreground text-center">Weather Sensor</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-2 p-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </div>
              <span className="text-xs font-medium text-muted-foreground">Auto-Trigger</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-background">
              <Wallet className="h-8 w-8 text-success" />
              <span className="text-xs font-medium text-muted-foreground text-center">Digital Wallet</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features */}
      <div className="mt-16 grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1, ease: [0.2, 0, 0, 1] }}
            className="bg-card p-5 rounded-xl shadow-card"
          >
            <div className="text-primary mb-3">{f.icon}</div>
            <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

export default LandingPage;
