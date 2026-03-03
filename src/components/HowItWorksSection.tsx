import { Search, Map, Code2, Headphones } from "lucide-react";

const steps = [
  {
    icon: Search,
    number: "01",
    title: "Diagnóstico",
    description: "Entendemos sua empresa, processos e desafios para identificar as melhores oportunidades.",
  },
  {
    icon: Map,
    number: "02",
    title: "Planejamento",
    description: "Desenhamos a solução ideal com escopo, tecnologias e cronograma definidos.",
  },
  {
    icon: Code2,
    number: "03",
    title: "Desenvolvimento",
    description: "Construímos sua solução com as melhores práticas e tecnologias modernas.",
  },
  {
    icon: Headphones,
    number: "04",
    title: "Implementação e Suporte",
    description: "Entregamos, treinamos e acompanhamos para garantir resultados contínuos.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="como-funciona" className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary tracking-wider uppercase mb-3">Como Funciona</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Do diagnóstico à entrega
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.number} className="relative text-center p-6">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
              )}
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-xl bg-accent/50 text-primary mb-5 border border-border">
                <step.icon className="h-7 w-7" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center font-display">
                  {step.number}
                </span>
              </div>
              <h3 className="font-display text-base font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
