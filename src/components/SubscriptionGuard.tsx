import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * SubscriptionGuard — Blocks access to platform routes unless
 * the logged-in user's email has a "Cliente Ativo" record in
 * the `customers` table (i.e., they paid via Stripe).
 *
 * Admin emails bypass this check automatically.
 */

const ADMIN_EMAILS = [
  "assasinghost910@gmail.com",
  // Add more team emails here
];

const SubscriptionGuard = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [status, setStatus] = useState<"loading" | "active" | "blocked">("loading");

  useEffect(() => {
    if (!user?.email) {
      setStatus("blocked");
      return;
    }

    // Admin bypass
    if (ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      setStatus("active");
      return;
    }

    // Check subscription
    const checkSubscription = async () => {
      const { data, error } = await supabase
        .from("customers" as any)
        .select("status")
        .eq("email", user.email!)
        .eq("status", "Cliente Ativo")
        .maybeSingle();

      if (error) {
        console.error("Subscription check error:", error);
        setStatus("blocked");
        return;
      }

      setStatus(data ? "active" : "blocked");
    };

    checkSubscription();
  }, [user]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <Loader2 className="h-8 w-8 animate-spin text-platform-green" />
      </div>
    );
  }

  if (status === "blocked") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] px-4">
        <div className="max-w-md w-full text-center p-8 rounded-2xl bg-[#111] border border-white/10">
          <div className="w-16 h-16 rounded-full bg-platform-orange/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-platform-orange" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
          <p className="text-[#888] mb-6">
            Você precisa ter uma assinatura ativa para acessar a plataforma Vincere.
            Escolha um plano abaixo para começar!
          </p>
          <div className="space-y-3">
            <a href="/plataforma/pagamentos">
              <Button className="w-full bg-platform-green hover:bg-platform-green/90 text-black font-semibold">
                Ver Planos e Assinar
              </Button>
            </a>
            <a href="/">
              <Button variant="outline" className="w-full border-white/10 text-white bg-transparent hover:bg-white/5 mt-2">
                Voltar ao Início
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default SubscriptionGuard;
