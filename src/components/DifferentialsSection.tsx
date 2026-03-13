import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const items = [
  "Tecnologia Moderna",
  "Soluções Escaláveis",
  "Foco em Resultado",
  "Atendimento Personalizado",
  "Inovação Constante",
];

const DifferentialsSection = () => {
  return (
    <section id="diferenciais" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#06071A]/50" />
      
      {/* Dynamic Background */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[120px]" />

      <div className="relative container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-primary tracking-wider uppercase mb-3">Diferenciais</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-white">
            Por que escolher a Vincere?
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {items.map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "rgba(124, 58, 237, 0.1)",
                borderColor: "rgba(124, 58, 237, 0.4)"
              }}
              className="flex items-center gap-3 px-8 py-5 rounded-2xl border border-white/5 bg-[#0A0A0A]/60 backdrop-blur-md cursor-default transition-all duration-300 group shadow-lg"
            >
              <div className="p-1 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-300">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors duration-300 tracking-wide">{item}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DifferentialsSection;
