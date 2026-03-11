import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Initialize Stripe outside of component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || "");

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  priceAmount: number;
}

export function CheckoutModal({ isOpen, onClose, planName, priceAmount }: CheckoutModalProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && planName && priceAmount) {
      setLoading(true);
      setClientSecret(null);

      // Call Supabase Edge Function to get the Stripe client_secret
      supabase.functions.invoke('create-checkout-session', {
        body: { planName, priceAmount }
      })
      .then(({ data, error }) => {
        if (error || !data?.clientSecret) {
          console.error("Stripe Checkout Error:", error);
          toast.error("Falha ao abrir o checkout. Verifique as configurações do servidor.");
          setLoading(false);
          onClose();
          return;
        }
        setClientSecret(data.clientSecret);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Erro desconhecido ao carregar checkout.");
        setLoading(false);
        onClose();
      });
    }
  }, [isOpen, planName, priceAmount, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative border border-border">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-display font-semibold">Assinar Plano {planName}</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-secondary/50 hover:bg-secondary rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#f6f9fc] dark:bg-[#0a0a0a]">
          {loading && (
            <div className="w-full h-64 flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
              <p>Conectando ao terminal de pagamento...</p>
            </div>
          )}
          
          {clientSecret && (
            <EmbeddedCheckoutProvider 
              stripe={stripePromise} 
              options={{ clientSecret }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          )}
        </div>
      </div>
    </div>
  );
}
