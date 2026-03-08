import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid-pattern bg-circuit">
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-accent/20 blur-[120px]" />
      <div className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-border/30 opacity-100" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-border/20 opacity-100" />

      <div className="relative z-10 container mx-auto px-4 md:px-8 text-center max-w-4xl">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-border bg-secondary/50 text-xs font-medium text-muted-foreground tracking-wider uppercase animate-fade-in">
          Soluções em Software & Inteligência Artificial
        </div>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up">
          Tecnologia pontecializadora <span className="text-gradient">de perfomance.</span>
        </h1>

        <p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          A Vincere desenvolve softwares e automações de inteligência artificial que otimizam processos e tomadas de
          decisão.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <a href="#cta">
            <Button size="lg" className="font-display font-semibold text-base px-8 gap-2">
              Solicitar Orçamento
              <ArrowRight className="h-4 w-4" />
            </Button>
          </a>
          <a href="#servicos">
            <Button variant="outline" size="lg" className="font-display font-semibold text-base px-8 gap-2">
              Conhecer Soluções
              <ChevronDown className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
