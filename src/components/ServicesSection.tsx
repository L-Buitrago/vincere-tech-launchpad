import { Bot, Wallet, Code2, Cog, Layout, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    icon: Layout,
    title: "Sites e Landing Pages",
    description: "Criação de páginas modernas focadas em alta conversão de leads e vendas.",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
    borderHover: "hover:border-blue-500/40",
    glowColor: "group-hover:shadow-blue-500/10",
  },
  {
    icon: ShoppingBag,
    title: "E-commerce e Lojas Virtuais",
    description: "Plataformas robustas de vendas com integrações de pagamento e frete.",
    gradient: "from-emerald-500/20 to-green-500/20",
    iconColor: "text-emerald-400",
    borderHover: "hover:border-emerald-500/40",
    glowColor: "group-hover:shadow-emerald-500/10",
  },
  {
    icon: Bot,
    title: "Agentes de IA Empresariais",
    description: "Automatize atendimento, vendas e suporte com inteligência artificial personalizada.",
    gradient: "from-purple-500/20 to-violet-500/20",
    iconColor: "text-purple-400",
    borderHover: "hover:border-purple-500/40",
    glowColor: "group-hover:shadow-purple-500/10",
  },
  {
    icon: Wallet,
    title: "Sistema de Controle Financeiro",
    description: "Gestão de fluxo de caixa, relatórios, controle de despesas e receitas.",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
    borderHover: "hover:border-amber-500/40",
    glowColor: "group-hover:shadow-amber-500/10",
  },
  {
    icon: Code2,
    title: "Softwares Sob Medida",
    description: "Desenvolvimento personalizado para necessidades específicas da sua empresa.",
    gradient: "from-rose-500/20 to-pink-500/20",
    iconColor: "text-rose-400",
    borderHover: "hover:border-rose-500/40",
    glowColor: "group-hover:shadow-rose-500/10",
  },
  {
    icon: Cog,
    title: "Automação de Processos",
    description: "Reduza custos e aumente eficiência com automações inteligentes.",
    gradient: "from-indigo-500/20 to-blue-500/20",
    iconColor: "text-indigo-400",
    borderHover: "hover:border-indigo-500/40",
    glowColor: "group-hover:shadow-indigo-500/10",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const ServicesSection = () => {
  return (
    <section id="servicos" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-primary tracking-wider uppercase mb-3">Nossos Serviços</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Soluções que impulsionam resultados
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tecnologia de ponta aplicada às reais necessidades do seu negócio.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
              className={`group relative p-8 rounded-xl border border-border bg-card/50 ${service.borderHover} transition-all duration-500 hover:shadow-2xl ${service.glowColor} cursor-pointer overflow-hidden`}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`} />
              
              {/* Shimmer line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                  className={`mb-5 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/50 ${service.iconColor} group-hover:bg-white/10 transition-all duration-300`}
                >
                  <service.icon className="h-6 w-6" />
                </motion.div>
                <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-white transition-colors">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-white/70 transition-colors">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
