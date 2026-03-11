import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import SubscriptionGuard from "@/components/SubscriptionGuard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Returns from "./pages/Returns";
import Admin from "./pages/Admin";
import PlatformLanding from "./pages/PlatformLanding";
import PlatformLayout from "./components/platform/PlatformLayout";
import PlatformDashboard from "./pages/PlatformDashboard";
import PlatformClients from "./pages/PlatformClients";
import PlatformProducts from "./pages/PlatformProducts";
import PlatformCheckouts from "./pages/PlatformCheckouts";
import PlatformPayments from "./pages/PlatformPayments";
import PlatformProposal from "./pages/PlatformProposal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/privacidade" element={<Privacy />} />
            <Route path="/termos" element={<Terms />} />
            <Route path="/devolucoes" element={<Returns />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              }
            />
            {/* Platform SaaS */}
            <Route path="/plataforma" element={<PlatformLanding />} />
            <Route path="/plataforma/proposta" element={<PlatformProposal />} />
            {/* Payments page is accessible to any logged-in user (so they can subscribe) */}
            <Route
              path="/plataforma/pagamentos"
              element={
                <ProtectedRoute>
                  <PlatformLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<PlatformPayments />} />
            </Route>
            {/* All other platform pages require an active subscription */}
            <Route 
              element={
                <ProtectedRoute>
                  <SubscriptionGuard>
                    <PlatformLayout />
                  </SubscriptionGuard>
                </ProtectedRoute>
              }
            >
              <Route path="/plataforma/dashboard" element={<PlatformDashboard />} />
              <Route path="/plataforma/clientes" element={<PlatformClients />} />
              <Route path="/plataforma/produtos" element={<PlatformProducts />} />
              <Route path="/plataforma/checkouts" element={<PlatformCheckouts />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
