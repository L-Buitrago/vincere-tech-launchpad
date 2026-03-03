import { Bot, Wallet, Code2, Cog } from "lucide-react";

const services = [
  {
    icon: Bot,
    title: "Agentes de IA Empresariais",
    description: "Automatize atendimento, vendas e suporte com inteligência artificial personalizada.",
  },
  {
    icon: Wallet,
    title: "Sistema de Controle Financeiro",
    description: "Gestão de fluxo de caixa, relatórios, controle de despesas e receitas.",
  },
  {
    icon: Code2,
    title: "Softwares Sob Medida",
    description: "Desenvolvimento personalizado para necessidades específicas da sua empresa.",
  },
  {
    icon: Cog,
    title: "Automação de Processos",
    description: "Reduza custos e aumente eficiência com automações inteligentes.",
  },
];

const ServicesSection = () => {
  return (
    <section id="servicos" className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary tracking-wider uppercase mb-3">Nossos Serviços</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Soluções que impulsionam resultados
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tecnologia de ponta aplicada às reais necessidades do seu negócio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative p-8 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-5 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/50 text-primary group-hover:bg-accent transition-colors">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
