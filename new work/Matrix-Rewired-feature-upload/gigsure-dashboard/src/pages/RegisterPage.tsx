import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ArrowRight, ArrowLeft } from "lucide-react";
import { workerAPI } from "@/lib/api";

const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"];
const platforms = ["Swiggy", "Zomato", "Dunzo", "Uber Eats", "BigBasket", "Blinkit"];
const idProofTypes = ["Aadhar", "PAN", "Driving License", "Passport", "Voter ID"];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", city: "", platform: "", hoursStart: "10:00", hoursEnd: "22:00", avgEarnings: "", idProofType: "", idProofNumber: "", password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.city) e.city = "Select a city";
    if (!form.platform) e.platform = "Select a platform";
    if (!form.idProofType) e.idProofType = "Select ID proof type";
    if (!form.idProofNumber.trim()) e.idProofNumber = "ID proof number is required";
    if (!form.password.trim()) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password should be at least 6 characters";
    if (!form.avgEarnings || Number(form.avgEarnings) <= 0) e.avgEarnings = "Enter valid earnings";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: form.name,
        city: form.city,
        platform: form.platform,
        workingHours: `${form.hoursStart}-${form.hoursEnd}`,
        avgHourlyIncome: Number(form.avgEarnings),
        idProofType: form.idProofType,
        idProofNumber: form.idProofNumber,
        password: form.password
      };

      const data = await workerAPI.register(payload);

      if (data.workerId) {
        // After registration, go to login (not dashboard)
        navigate("/login", { replace: true });
      } else {
        setApiError(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setApiError("Failed to register. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 bg-card border border-border rounded-md text-foreground text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none disabled:opacity-50";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";
  const errorClass = "text-xs text-destructive mt-1";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </motion.button>

        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 text-primary mb-3"
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6" />
            </div>
            <span className="font-semibold text-lg">Matrix Insurance</span>
          </motion.div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground">Create your profile</h1>
          <p className="text-sm text-muted-foreground mt-1">We'll use this to calculate your coverage</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-card p-6 space-y-4">
          {apiError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive"
            >
              {apiError}
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <label className={labelClass}>Full Name</label>
            <input 
              className={inputClass} 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              placeholder="Rahul Sharma"
              disabled={loading}
            />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              className={inputClass}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Minimum 6 characters"
              disabled={loading}
            />
            {errors.password && <p className={errorClass}>{errors.password}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <label className={labelClass}>City</label>
            <select 
              className={inputClass} 
              value={form.city} 
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              disabled={loading}
            >
              <option value="">Select city</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.city && <p className={errorClass}>{errors.city}</p>}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <label className={labelClass}>Delivery Platform</label>
            <select 
              className={inputClass} 
              value={form.platform} 
              onChange={(e) => setForm({ ...form, platform: e.target.value })}
              disabled={loading}
            >
              <option value="">Select platform</option>
              {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.platform && <p className={errorClass}>{errors.platform}</p>}
          </motion.div>

          {/* ID Proof Section */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <label className="block text-sm font-medium text-foreground mb-2">ID Proof Verification</label>
            <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg mb-3">
              <p className="text-xs text-muted-foreground">We need a valid ID to verify your identity</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>ID Type</label>
                <select 
                  className={inputClass} 
                  value={form.idProofType} 
                  onChange={(e) => setForm({ ...form, idProofType: e.target.value })}
                  disabled={loading}
                >
                  <option value="">Select ID type</option>
                  {idProofTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                {errors.idProofType && <p className={errorClass}>{errors.idProofType}</p>}
              </div>
              <div>
                <label className={labelClass}>ID Number</label>
                <input 
                  type="text"
                  className={inputClass} 
                  value={form.idProofNumber} 
                  onChange={(e) => setForm({ ...form, idProofNumber: e.target.value })} 
                  placeholder="XXXX-XXXX-XXXX"
                  disabled={loading}
                />
                {errors.idProofNumber && <p className={errorClass}>{errors.idProofNumber}</p>}
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 gap-3"
          >
            <div>
              <label className={labelClass}>Shift Start</label>
              <input 
                type="time" 
                className={inputClass} 
                value={form.hoursStart} 
                onChange={(e) => setForm({ ...form, hoursStart: e.target.value })}
                disabled={loading}
              />
            </div>
            <div>
              <label className={labelClass}>Shift End</label>
              <input 
                type="time" 
                className={inputClass} 
                value={form.hoursEnd} 
                onChange={(e) => setForm({ ...form, hoursEnd: e.target.value })}
                disabled={loading}
              />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <label className={labelClass}>Average Hourly Earnings (₹)</label>
            <input 
              type="number" 
              className={inputClass} 
              value={form.avgEarnings} 
              onChange={(e) => setForm({ ...form, avgEarnings: e.target.value })} 
              placeholder="150"
              disabled={loading}
            />
            {errors.avgEarnings && <p className={errorClass}>{errors.avgEarnings}</p>}
            <p className="text-xs text-muted-foreground mt-1">Used to calculate your coverage amount</p>
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-md shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_2px_4px_rgba(0,0,0,0.1)] hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                Create Profile
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </motion.button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Your data is secure and stored locally
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
