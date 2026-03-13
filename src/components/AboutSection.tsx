import { Target } from "lucide-react";
import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section id="sobre" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#0A0A0A]" />
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/50 text-primary mb-6 relative group"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-lg group-hover:blur-xl transition-all duration-300" />
            <Target className="h-7 w-7 relative z-10" />
          </motion.div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-sm font-medium text-primary tracking-wider uppercase mb-3"
          >
            Sobre Nós
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="font-display text-3xl md:text-4xl font-bold mb-6 text-white"
          >
            Tecnologia Personalizada
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-xl leading-relaxed mb-6"
          >
            Geramos valor às empresas otimizando processos e tomadas de decisão através de automação de IA, relatórios e
            softwares personalizados para o seu negócio.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
