import { CheckCircle2 } from "lucide-react";

const items = [
  "Tecnologia Moderna",
  "Soluções Escaláveis",
  "Foco em Resultado",
  "Atendimento Personalizado",
  "Inovação Constante",
];

const DifferentialsSection = () => {
  return (
    <section id="diferenciais" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="relative container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary tracking-wider uppercase mb-3">Diferenciais</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Por que escolher a Vincere?
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
          {items.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3 px-6 py-4 rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-colors"
            >
              <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="font-medium text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DifferentialsSection;
