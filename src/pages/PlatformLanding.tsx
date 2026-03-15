import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShoppingCart, Zap, MessageCircle, GraduationCap,
  Link2, BarChart3, Check, ArrowRight, Star, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalMap } from "@/components/platform/GlobalMap";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const }
  }),
};

const features = [
  { icon: ShoppingCart, title: "Checkout Completo", desc: "Otimizado para conversão máxima com one-click checkout e múltiplos meios de pagamento.", color: "text-violet-400" },
  { icon: Zap, title: "Entrega Automática", desc: "O cliente paga e recebe acesso na hora. Sem atrasos, sem fricção.", color: "text-yellow-400" },
  { icon: MessageCircle, title: "Recuperação no WhatsApp", desc: "Mensagens automáticas para quem abandonou o checkout. Recupere até 30% das vendas.", color: "text-violet-400" },
  { icon: GraduationCap, title: "Área de Membros", desc: "Seus alunos acessam tudo em um só lugar. Cursos, módulos e certificados.", color: "text-blue-400" },
  { icon: Link2, title: "Integrações", desc: "Stripe, Pagar.me, Kiwify e mais. Conecte com as ferramentas que você já usa.", color: "text-purple-400" },
  { icon: BarChart3, title: "Dashboard em Tempo Real", desc: "Veja sua receita crescer ao vivo. Métricas, gráficos e insights acionáveis.", color: "text-platform-orange" },
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
            <span className="font-semibold text-white tracking-tight">Vincere</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#888]">
            <a href="#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#depoimentos" className="hover:text-white transition-colors">Depoimentos</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-[#888] hover:text-white hover:bg-white/5">Entrar / Cadastrar</Button>
            </Link>
            <Link to="/plataforma/proposta">
              <Button size="sm" className="bg-platform-purple hover:bg-platform-purple/90 text-white font-semibold text-xs">
                Começar grátis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-500/5 rounded-full blur-[150px]" />
          <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] bg-violet-500/3 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-violet-400 text-xs font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by Vincere
            </span>
          </motion.div>

          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
          >
            Você cria. Entrega.{" "}
            <span className="bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
              Cresce sem limites.
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
              <Button size="lg" className="bg-platform-purple hover:bg-platform-purple/90 text-white font-semibold px-8 gap-2 h-12 text-base">
                Começar agora
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/plataforma/demonstracao">
              <Button variant="outline" size="lg" className="border-white/10 text-white hover:bg-white/5 font-semibold px-8 h-12 text-base bg-transparent">
                Ver demonstração
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-24 sm:py-32 relative">
        {/* Subtle background particles/rays */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={fadeUp} custom={0}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
              Tudo que você precisa para <br />
              <span className="text-[#888]">vender globalmente.</span>
            </h2>
            <p className="text-[#666] text-lg max-w-2xl mx-auto leading-relaxed">
              Uma suite completa de ferramentas projetadas para escala, performance e conversão em qualquer lugar do mundo.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden" whileInView="visible" viewport={{ once: true }}
                variants={fadeUp} custom={i}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="relative group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-violet-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/[0.05] overflow-hidden"
              >
                {/* Hover Glow */}
                <div className="absolute inset-x-0 inset-y-0 bg-gradient-to-br from-violet-500/0 via-transparent to-transparent group-hover:from-violet-500/5 transition-all duration-500" />
                
                <div className={`relative z-10 w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${f.color} group-hover:scale-110 group-hover:bg-violet-500/10 transition-all duration-500`}>
                  <f.icon className="w-6 h-6" />
                </div>
                
                <h3 className="relative z-10 text-xl font-bold mb-3 text-white tracking-tight">{f.title}</h3>
                <p className="relative z-10 text-[#666] leading-relaxed text-sm group-hover:text-[#888] transition-colors">
                  {f.desc}
                </p>

                {/* Decorative corner accent */}
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Map */}
      <GlobalMap />

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
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-6 rounded-2xl bg-[#111] border border-white/5 hover:border-purple-500/20 transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-violet-400 text-violet-400" />
                  ))}
                </div>
                <p className="text-sm text-[#ccc] leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-purple-500/15 text-violet-400 flex items-center justify-center text-xs font-bold">
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
              <Button size="lg" className="bg-platform-purple hover:bg-platform-purple/90 text-white font-semibold px-10 h-12 text-base gap-2">
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
