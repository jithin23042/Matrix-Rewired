import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { workerAPI } from "@/lib/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.password.trim()) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!validate()) return;
    setLoading(true);

    try {
      const data = await workerAPI.login({ name: form.name, password: form.password });
      if (!data || !data.user) {
        setApiError(data?.message || "Invalid credentials");
      } else {
        // Set worker ID locally so dashboard access works
        localStorage.setItem("workerId", data.user.id);
        localStorage.setItem("workerData", JSON.stringify(data.user));
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setApiError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const labelClass = "block text-sm font-medium leading-6 text-foreground";
  const inputClass = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";
  const errorClass = "mt-1 text-xs text-destructive";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 text-primary mb-3"
          >
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6" />
            </div>
            <span className="font-semibold text-lg">Login</span>
          </motion.div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground">Existing user login</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter your name and password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-card p-6 space-y-4">
          {apiError && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{apiError}</div>}

          <div>
            <label className={labelClass}>Name</label>
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Rahul Sharma"
              disabled={loading}
            />
            {errors.name && <p className={errorClass}>{errors.name}</p>}
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              className={inputClass}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="●●●●●●"
              disabled={loading}
            />
            {errors.password && <p className={errorClass}>{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-2 text-white font-semibold hover:brightness-110 transition-all disabled:opacity-70"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-xs text-muted-foreground">Don't have an account? <a href="/register" className="font-semibold text-primary">Register</a></p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
