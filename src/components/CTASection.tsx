import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section id="cta" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-secondary/50" />
      <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-accent/20 blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full bg-primary/10 blur-[80px]" />

      <div className="relative container mx-auto px-4 md:px-8 text-center">
        <h2 className="font-display text-3xl md:text-5xl font-bold mb-6">
          Pronto para transformar{" "}
          <span className="text-gradient">sua empresa?</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
          Entre em contato e descubra como a tecnologia pode acelerar seus resultados.
        </p>
        <Button
          size="lg"
          className="font-display font-semibold text-base px-10 gap-2"
          onClick={() => {
            document.getElementById('pacotes')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Ver Nossos Pacotes
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
