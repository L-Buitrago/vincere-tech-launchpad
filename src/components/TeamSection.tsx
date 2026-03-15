import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const team = [
  {
    name: "Nathan",
    role: "Fundador & Desenvolvedor",
    initials: "N",
    description:
      "Apaixonado por construir soluções que fazem a diferença. Lidera o desenvolvimento técnico com foco em qualidade, performance e inovação.",
  },
  {
    name: "Luis",
    role: "Fundador & Desenvolvedor",
    initials: "L",
    description:
      "Responsável pela visão de negócios e estratégia. Conecta tecnologia a resultados concretos, garantindo que cada solução gere valor real.",
  },
  {
    name: "Ryan",
    role: "Fundador & Especialista em Soluções",
    initials: "R",
    description:
      "Especialista em entender necessidades e projetar soluções sob medida. Garante que cada projeto entregue exatamente o que o cliente precisa.",
  },
];

const TeamSection = () => {
  return (
    <section id="equipe" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] -ml-24 -mb-24" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-primary tracking-wider uppercase mb-3">Quem Somos</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-white">A equipe por trás da inovação</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group text-center p-8 rounded-2xl border border-white/5 bg-[#0A0A0A]/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 relative"
            >
              {/* Card Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              
              <div className="relative z-10">
                <Avatar className="w-24 h-24 mx-auto mb-6 border-4 border-[#1A1A1A] group-hover:border-primary/40 transition-colors duration-300 shadow-xl">
                  <AvatarFallback className="bg-gradient-to-br from-accent to-primary/20 text-primary font-display text-3xl font-bold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-display text-xl font-bold mb-1 text-white group-hover:text-primary transition-colors duration-300">{member.name}</h3>
                <p className="text-primary/80 text-sm font-medium mb-5 uppercase tracking-wide">{member.role}</p>
                <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-slate-300 transition-colors duration-300">{member.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
