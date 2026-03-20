import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Camera,
  Upload,
  Shield,
  Eye,
} from "lucide-react";
import AppNav from "@/components/AppNav";
import { payoutAPI } from "@/lib/api";

const HailstormClaimPage = () => {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState("");
  const [verification, setVerification] = useState({
    hailProof: false,
    locationProof: false,
    weatherScope: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payout, setPayout] = useState<any>(null);

  const allVerified =
    verification.hailProof &&
    verification.locationProof &&
    verification.weatherScope &&
    videoFile;

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setVideoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!allVerified) {
      setError("Please upload video and complete verification");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const workerId = localStorage.getItem("workerId");
      if (!workerId) {
        setError("Worker not found");
        setLoading(false);
        return;
      }

      // Create payout
      const payoutResult = await payoutAPI.create({
        workerId,
        reason: "Hailstorm - Video Verified",
        hoursLost: 2,
        disruptionType: "hail",
      });

      setPayout(payoutResult.payout);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit claim");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <AppNav />

      <div className="container py-6 max-w-2xl space-y-6">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() =>
            navigate(submitted ? "/dashboard" : "/claim")
          }
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {submitted ? "Back to Dashboard" : "Back to Claims"}
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-purple-500/20 to-purple-600/5 border border-purple-200 rounded-xl p-6 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="h-12 w-12 mx-auto mb-3 rounded-full bg-purple-500/10 flex items-center justify-center"
          >
            <span className="text-2xl">⛈️</span>
          </motion.div>
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Hailstorm Claim
          </h1>
          <p className="text-sm text-muted-foreground">
            Severe hail activity event
          </p>
        </motion.div>

        {/* Success State */}
        <AnimatePresence>
          {submitted && payout && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-xl p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
              >
                <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
              </motion.div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Claim Submitted Successfully!
              </h2>
              <p className="text-muted-foreground mb-4">
                Your video claim has been verified and payout triggered.
              </p>
              <div className="p-4 bg-white rounded-lg mb-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                  Payout Amount
                </p>
                <p className="text-3xl font-bold text-green-600">
                  ₹{payout.amount.toFixed(0)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Status: {payout.status}
                </p>
              </div>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:brightness-110 transition-all"
              >
                Back to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        {!submitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Video Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50"
            >
              <div className="flex items-center gap-2 mb-4">
                <Camera className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold text-foreground">
                  Video Evidence
                </h3>
              </div>

              {videoPreview ? (
                <div className="space-y-3">
                  <video
                    controls
                    src={videoPreview}
                    className="w-full h-64 object-cover rounded-lg bg-black/50"
                  />
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      Video uploaded: {videoFile?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setVideoFile(null);
                      setVideoPreview("");
                    }}
                    className="w-full py-2 px-3 border border-border rounded-lg text-sm font-medium hover:bg-card transition-colors"
                  >
                    Change Video
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-purple-500/50 transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground mb-1">
                    Upload Video or Live Stream
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    MP4, WebM (max 100MB)
                  </p>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="inline-block px-4 py-2 bg-purple-500 text-white font-medium rounded-lg cursor-pointer hover:brightness-110 transition-all"
                  >
                    Select Video
                  </label>
                </div>
              )}
            </motion.div>

            {/* Verification Checklist */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-border/50"
            >
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold text-foreground">
                  Authenticity Verification
                </h3>
              </div>

              <div className="space-y-3">
                {[
                  {
                    key: "hailProof",
                    label: "Hailstones clearly visible",
                    hint: "Show size and density of hail",
                  },
                  {
                    key: "locationProof",
                    label: "Location identifier visible",
                    hint: "Street view or building reference",
                  },
                  {
                    key: "weatherScope",
                    label: "Hailstorm intensity shown",
                    hint: "Show the severity and impact",
                  },
                ].map((item) => (
                  <motion.label
                    key={item.key}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-card/80 transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={
                        verification[
                          item.key as keyof typeof verification
                        ]
                      }
                      onChange={(e) =>
                        setVerification({
                          ...verification,
                          [item.key]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-border mt-1"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.hint}
                      </p>
                    </div>
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={!allVerified || loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                allVerified && !loading
                  ? "bg-purple-500 text-white hover:brightness-110"
                  : "bg-muted text-muted-foreground opacity-50"
              }`}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Submit Verified Claim
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HailstormClaimPage;
