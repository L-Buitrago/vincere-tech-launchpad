import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShoppingCart, Zap, MessageCircle, GraduationCap,
  Link2, BarChart3, Check, ArrowRight, Star, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }
  }),
};

const features = [
  { icon: ShoppingCart, title: "Checkout Completo", desc: "Otimizado para conversão máxima com one-click checkout e múltiplos meios de pagamento.", color: "text-platform-green" },
  { icon: Zap, title: "Entrega Automática", desc: "O cliente paga e recebe acesso na hora. Sem atrasos, sem fricção.", color: "text-yellow-400" },
  { icon: MessageCircle, title: "Recuperação no WhatsApp", desc: "Mensagens automáticas para quem abandonou o checkout. Recupere até 30% das vendas.", color: "text-platform-green" },
  { icon: GraduationCap, title: "Área de Membros", desc: "Seus alunos acessam tudo em um só lugar. Cursos, módulos e certificados.", color: "text-blue-400" },
  { icon: Link2, title: "Integrações", desc: "Stripe, Pagar.me, Kiwify e mais. Conecte com as ferramentas que você já usa.", color: "text-purple-400" },
  { icon: BarChart3, title: "Dashboard em Tempo Real", desc: "Veja sua receita crescer ao vivo. Métricas, gráficos e insights acionáveis.", color: "text-platform-orange" },
];

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

const testimonials = [
  { name: "Rafaela Mendes", role: "CEO, EduTech Brasil", text: "Em 3 meses, triplicamos nossas vendas. O checkout da Vincere é absurdamente eficiente.", avatar: "RM" },
  { name: "Lucas Andrade", role: "Infoprodutor", text: "A recuperação por WhatsApp sozinha já pagou a assinatura 10x. Ferramenta indispensável.", avatar: "LA" },
  { name: "Mariana Costa", role: "Diretora, Escola Conecta", text: "Finalmente uma plataforma brasileira que entende nossas necessidades. Migrei e nunca mais voltei.", avatar: "MC" },
];

export default function PlatformLanding() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-body overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/plataforma" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-platform-green flex items-center justify-center text-black font-bold text-xs">V</div>
            <span className="font-semibold text-white tracking-tight">Vincere</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#888]">
            <a href="#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
            <a href="#depoimentos" className="hover:text-white transition-colors">Depoimentos</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-[#888] hover:text-white hover:bg-white/5">Login</Button>
            </Link>
            <Link to="/plataforma/proposta">
              <Button size="sm" className="bg-platform-green hover:bg-platform-green/90 text-black font-semibold text-xs">
                Começar grátis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-platform-green/5 rounded-full blur-[150px]" />
          <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] bg-platform-green/3 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-platform-green/10 border border-platform-green/20 text-platform-green text-xs font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Vincere
            </span>
          </motion.div>

          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
          >
            Você vende. Recebe.{" "}
            <span className="bg-gradient-to-r from-platform-green to-emerald-400 bg-clip-text text-transparent">
              Continua escalando.
            </span>
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-lg sm:text-xl text-[#888] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Checkout completo, área de membros, recuperação automática no WhatsApp e entrega instantânea — tudo em um único lugar.
          </motion.p>

          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/plataforma/proposta">
              <Button size="lg" className="bg-platform-green hover:bg-platform-green/90 text-black font-semibold px-8 gap-2 h-12 text-base">
                Começar agora grátis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/plataforma/dashboard">
              <Button variant="outline" size="lg" className="border-white/10 text-white hover:bg-white/5 font-semibold px-8 h-12 text-base bg-transparent">
                Ver demonstração
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Tudo que você precisa para vender online</h2>
            <p className="text-[#888] text-lg max-w-xl mx-auto">
              Uma plataforma completa para criar, vender e entregar seus produtos digitais.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="group p-6 rounded-2xl bg-[#111] border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4 ${f.color} group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{f.title}</h3>
                <p className="text-sm text-[#888] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="py-24 sm:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Planos para cada fase do seu negócio</h2>
            <p className="text-[#888] text-lg">Comece grátis. Escale quando estiver pronto.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className={`relative p-7 rounded-2xl border transition-all duration-300 ${
                  plan.popular
                    ? "bg-[#111] border-platform-green/30 shadow-[0_0_40px_rgba(0,195,127,0.06)]"
                    : "bg-[#111] border-white/5 hover:border-white/10"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-platform-green text-black text-[10px] font-bold uppercase rounded-full tracking-wider">
                    Mais popular
                  </span>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-[#888] mb-5">{plan.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-sm text-[#888]">R$</span>
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-sm text-[#888]">/mês</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#ccc]">
                      <Check className="w-4 h-4 text-platform-green shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/plataforma/proposta">
                  <Button
                    className={`w-full font-semibold h-11 ${
                      plan.popular
                        ? "bg-platform-green hover:bg-platform-green/90 text-black"
                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    }`}
                  >
                    Assinar agora
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-24 sm:py-32 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Quem usa, recomenda</h2>
            <p className="text-[#888] text-lg">Veja o que nossos clientes dizem sobre a Vincere.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                className="p-6 rounded-2xl bg-[#111] border border-white/5"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-platform-green text-platform-green" />
                  ))}
                </div>
                <p className="text-sm text-[#ccc] leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-platform-green/15 text-platform-green flex items-center justify-center text-xs font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{t.name}</p>
                    <p className="text-xs text-[#888]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 sm:py-32 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <h2 className="text-3xl sm:text-4xl font-bold mb-5">Pronto para escalar suas vendas?</h2>
            <p className="text-[#888] text-lg mb-8">
              Junte-se a centenas de empreendedores que já vendem mais com a Vincere.
            </p>
            <Link to="/plataforma/proposta">
              <Button size="lg" className="bg-platform-green hover:bg-platform-green/90 text-black font-semibold px-10 h-12 text-base gap-2">
                Solicitar proposta
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-platform-green flex items-center justify-center text-black font-bold text-[10px]">V</div>
            <span className="text-sm text-[#888]">© 2026 Vincere. Todos os direitos reservados.</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-[#666]">
            <Link to="/privacidade" className="hover:text-white transition-colors">Privacidade</Link>
            <Link to="/termos" className="hover:text-white transition-colors">Termos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
