import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const team = [
  {
    name: "Nathan",
    role: "fundador & Desenvolvedor",
    initials: "N",
    description:
      "Apaixonado por construir soluções que fazem a diferença. Lidera o desenvolvimento técnico com foco em qualidade, performance e inovação.",
  },
  {
    name: "Luis",
    role: "Co-fundador & Desenvolvedor",
    initials: "L",
    description:
      "Responsável pela visão de negócios e estratégia. Conecta tecnologia a resultados concretos, garantindo que cada solução gere valor real.",
  },
  {
    name: "Ryan",
    role: "Co-fundador & Especialista em Soluções",
    initials: "R",
    description:
      "Especialista em entender necessidades e projetar soluções sob medida. Garante que cada projeto entregue exatamente o que o cliente precisa.",
  },
];

const TeamSection = () => {
  return (
    <section id="equipe" className="py-24 md:py-32">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary tracking-wider uppercase mb-3">Quem Somos</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">A equipe por trás da inovação</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {team.map((member) => (
            <div
              key={member.name}
              className="text-center p-8 rounded-xl border border-border bg-card/50 hover:bg-card transition-all duration-300"
            >
              <Avatar className="w-20 h-20 mx-auto mb-5 border-2 border-primary/30">
                <AvatarFallback className="bg-accent text-primary font-display text-2xl font-bold">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-display text-lg font-semibold mb-1">{member.name}</h3>
              <p className="text-primary text-sm font-medium mb-4">{member.role}</p>
              <p className="text-muted-foreground text-sm leading-relaxed">{member.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
