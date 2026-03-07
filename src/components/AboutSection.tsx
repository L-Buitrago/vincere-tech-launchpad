import { Target } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="sobre" className="py-24 md:py-32 relative">
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="relative container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/50 text-primary mb-6">
            <Target className="h-7 w-7" />
          </div>
          <p className="text-sm font-medium text-primary tracking-wider uppercase mb-3">Sobre Nós</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Tecnologia Personalizada</h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-6">
            A Vincere Tech nasceu com o propósito de ajudar empresas a evoluírem através da tecnologia. Nosso foco é
            desenvolver soluções modernas, eficientes e escaláveis que geram resultados reais.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Combinamos expertise técnica com visão estratégica para entregar softwares que transformam processos,
            reduzem custos e abrem novas oportunidades de crescimento para nossos clientes.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
