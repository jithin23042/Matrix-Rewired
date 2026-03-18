import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad"];
const platforms = ["Swiggy", "Zomato", "Dunzo", "Uber Eats", "BigBasket", "Blinkit"];

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "", city: "", platform: "", hoursStart: "10:00", hoursEnd: "22:00", avgEarnings: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.city) e.city = "Select a city";
    if (!form.platform) e.platform = "Select a platform";
    if (!form.avgEarnings || Number(form.avgEarnings) <= 0) e.avgEarnings = "Enter valid earnings";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validate()) return;

  try {
    const payload = {
      name: form.name,
      city: form.city,
      platform: form.platform,
      workingHours: `${form.hoursStart}-${form.hoursEnd}`,
      avgHourlyIncome: Number(form.avgEarnings)
    };

    const response = await fetch("http://localhost:5000/worker/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    console.log("API Response:", data);

    // Store workerId (important for next pages)
    localStorage.setItem("workerId", data.workerId);

    navigate("/dashboard");

  } catch (error) {
    console.error("Registration error:", error);
    alert("Failed to register worker. Please try again.");
  }
};

  const inputClass = "w-full px-3 py-2.5 bg-card border border-border rounded-md text-foreground text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none";
  const labelClass = "block text-sm font-medium text-foreground mb-1.5";
  const errorClass = "text-xs text-destructive mt-1";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-primary mb-3">
            <Shield className="h-6 w-6" />
            <span className="font-semibold text-lg">Matrix Insurance</span>
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground">Create your profile</h1>
          <p className="text-sm text-muted-foreground mt-1">We'll use this to calculate your coverage</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-card p-6 space-y-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Rahul Sharma" />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>

          <div>
            <label className={labelClass}>City</label>
            <select className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
              <option value="">Select city</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.city && <p className={errorClass}>{errors.city}</p>}
          </div>

          <div>
            <label className={labelClass}>Delivery Platform</label>
            <select className={inputClass} value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
              <option value="">Select platform</option>
              {platforms.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            {errors.platform && <p className={errorClass}>{errors.platform}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Shift Start</label>
              <input type="time" className={inputClass} value={form.hoursStart} onChange={(e) => setForm({ ...form, hoursStart: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Shift End</label>
              <input type="time" className={inputClass} value={form.hoursEnd} onChange={(e) => setForm({ ...form, hoursEnd: e.target.value })} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Average Hourly Earnings (₹)</label>
            <input type="number" className={inputClass} value={form.avgEarnings} onChange={(e) => setForm({ ...form, avgEarnings: e.target.value })} placeholder="150" />
            {errors.avgEarnings && <p className={errorClass}>{errors.avgEarnings}</p>}
            <p className="text-xs text-muted-foreground mt-1">Used to calculate your coverage amount</p>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-md shadow-[0_0_0_1px_rgba(0,0,0,0.1)_inset,0_2px_4px_rgba(0,0,0,0.1)] hover:brightness-110 transition-all"
          >
            Create Profile
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
