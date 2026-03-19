import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, ArrowLeft, FileQuestion } from "lucide-react";
import AppNav from "@/components/AppNav";

const InsuranceClaimPage = () => {
  const navigate = useNavigate();

  const claimTypes = [
    {
      id: "rain",
      label: "Heavy Rain",
      icon: "🌧️",
      description: "Rainfall above 22mm/hr",
      color: "from-blue-500/20 to-blue-600/5",
      borderColor: "border-blue-200",
    },
    {
      id: "flood",
      label: "Flood",
      icon: "🌊",
      description: "Water level disruption",
      color: "from-cyan-500/20 to-cyan-600/5",
      borderColor: "border-cyan-200",
    },
    {
      id: "hail",
      label: "Hailstorm",
      icon: "⛈️",
      description: "Severe hail activity",
      color: "from-purple-500/20 to-purple-600/5",
      borderColor: "border-purple-200",
    },
    {
      id: "curfew",
      label: "Curfew",
      icon: "🚨",
      description: "Movement restrictions",
      color: "from-red-500/20 to-red-600/5",
      borderColor: "border-red-200",
    },
  ];

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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="h-12 w-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center"
          >
            <FileText className="h-6 w-6 text-primary" />
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-1">
            Insurance Claim
          </h1>
          <p className="text-sm text-muted-foreground">
            Select a disruption type to submit a claim with video proof
          </p>
        </motion.div>

        {/* Claim Type Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {claimTypes.map((claim, idx) => (
            <motion.button
              key={claim.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/claim/${claim.id}`)}
              className={`bg-gradient-to-br ${claim.color} border ${claim.borderColor} rounded-xl p-6 text-left hover:shadow-md transition-all group cursor-pointer h-full`}
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {claim.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-1">{claim.label}</h3>
              <p className="text-xs text-muted-foreground mb-4">{claim.description}</p>
              <div className="flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <FileQuestion className="h-4 w-4" />
                File Claim
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="p-4 rounded-lg bg-primary/5 border border-primary/20"
        >
          <p className="text-sm text-foreground font-medium mb-2">How to File a Claim</p>
          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
            <li>• Select the type of disruption you experienced</li>
            <li>• Upload or stream live video evidence</li>
            <li>• Complete the authenticity verification</li>
            <li>• Submit your claim for processing</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default InsuranceClaimPage;
