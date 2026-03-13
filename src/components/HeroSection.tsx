import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import VideoPlayer from "./VideoPlayer";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

const partnerLogos = [
  "Stripe", "Supabase", "OpenAI", "Vercel", "Pagar.me", "Kiwify"
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#000000]">
      {/* HLS Video Background */}
      <div className="absolute bottom-[35vh] left-0 right-0 h-[80vh] z-0">
        <VideoPlayer
          src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 text-center max-w-5xl">
        {/* Badges */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0}
          className="flex items-center justify-center gap-3 mb-8 flex-wrap"
        >
          {["Software", "IA", "Automação"].map((label) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10 text-xs font-medium text-white/70 tracking-wider uppercase"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
              {label}
            </span>
          ))}
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={1}
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-bold leading-[1.05] tracking-tight mb-6"
        >
          <span className="text-white">Você cria. Entrega.</span>
          <br />
          <span className="bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
            Cresce sem limites.
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={2}
          className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          A Vincere desenvolve softwares e automações de inteligência artificial que otimizam processos e tomadas de decisão.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={3}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#pacotes"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("pacotes")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            <Button
              size="lg"
              className="font-display font-semibold text-base px-8 gap-2 bg-black text-white border border-white/20 hover:bg-white/10 h-12"
            >
              Solicitar Orçamento
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
          <a href="#servicos">
            <Button
              variant="outline"
              size="lg"
              className="font-display font-semibold text-base px-8 gap-2 bg-white/[0.05] backdrop-blur-md border-white/10 text-white hover:bg-white/10 h-12"
            >
              Conhecer Soluções
              <ChevronDown className="h-4 w-4" />
            </Button>
          </a>
        </motion.div>

        {/* Logo Marquee */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={4}
          className="mt-20 flex items-center justify-center gap-10 flex-wrap opacity-40"
        >
          {partnerLogos.map((name) => (
            <span
              key={name}
              className="text-sm font-medium text-white/60 tracking-wide grayscale"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
};

export default HeroSection;
