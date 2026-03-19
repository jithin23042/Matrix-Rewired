import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import InsurancePage from "./pages/InsurancePage";
import InsuranceClaimPage from "./pages/InsuranceClaimPage";
import RainClaimPage from "./pages/RainClaimPage";
import FloodClaimPage from "./pages/FloodClaimPage";
import HailstormClaimPage from "./pages/HailstormClaimPage";
import CurfewClaimPage from "./pages/CurfewClaimPage";
import PayoutPage from "./pages/PayoutPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/insurance" element={<InsurancePage />} />
          <Route path="/claim" element={<InsuranceClaimPage />} />
          <Route path="/claim/rain" element={<RainClaimPage />} />
          <Route path="/claim/flood" element={<FloodClaimPage />} />
          <Route path="/claim/hail" element={<HailstormClaimPage />} />
          <Route path="/claim/curfew" element={<CurfewClaimPage />} />
          <Route path="/payout" element={<PayoutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
