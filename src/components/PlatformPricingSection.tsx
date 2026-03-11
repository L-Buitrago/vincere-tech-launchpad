import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const }
  }),
};

const plans = [
  {
    name: "Starter",
    price: "97",
    desc: "Para quem está começando",
    features: ["Até 100 vendas/mês", "1 checkout personalizado", "Entrega automática", "Dashboard básico", "Suporte por email"],
    popular: false,
  },
  {
    name: "Pro",
    price: "197",
    desc: "Para escalar suas vendas",
    features: ["Vendas ilimitadas", "Checkouts ilimitados", "WhatsApp recovery", "Área de membros", "Dashboard avançado", "Integrações premium", "Suporte prioritário"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "497",
    desc: "Para operações robustas",
    features: ["Tudo do Pro", "Multi-usuário", "API dedicada", "White-label", "Suporte dedicado 24/7", "Onboarding personalizado", "SLA garantido"],
    popular: false,
  },
];

const PlatformPricingSection = () => {
  return (
    <section id="plataforma-precos" className="py-24 sm:py-32 bg-[#0A0A0A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          variants={fadeUp} custom={0}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-platform-green tracking-wider uppercase mb-3">Plataforma Vincere</p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-display">Tudo para vender e entregar seus infoprodutos</h2>
          <p className="text-[#888] text-lg max-w-xl mx-auto">
            A infraestrutura completa de checkout, área de membros e entrega automática para o seu negócio digital rodar no piloto automático.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              variants={fadeUp} custom={i}
              className={`relative p-7 rounded-2xl border transition-all duration-300 ${
                plan.popular
                  ? "bg-[#111] border-platform-green/50 shadow-[0_0_40px_rgba(0,195,127,0.1)] scale-100 md:scale-105 z-10"
                  : "bg-[#111] border-white/5 hover:border-white/10"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-platform-green text-black text-[10px] font-bold uppercase rounded-full tracking-wider">
                  Mais popular
                </span>
              )}
              <h3 className="text-xl font-bold mb-1 font-display">{plan.name}</h3>
              <p className="text-sm text-[#888] mb-5">{plan.desc}</p>
              <div className="flex items-baseline gap-1 mb-6 border-b border-white/10 pb-6">
                <span className="text-sm text-[#888]">R$</span>
                <span className="text-4xl font-bold text-white tracking-tight">{plan.price}</span>
                <span className="text-sm text-[#888]">/mês</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-[#ccc]">
                    <Check className="w-4 h-4 text-platform-green shrink-0 mt-0.5" />
                    <span className="leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/plataforma/proposta">
                <Button
                  className={`w-full font-semibold h-12 text-base ${
                    plan.popular
                      ? "bg-platform-green hover:bg-platform-green/90 text-black"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  Criar conta grátis
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlatformPricingSection;
