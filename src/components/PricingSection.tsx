import { Check, ArrowRight, ShieldCheck, Zap, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";

const packages = [
  {
    icon: Zap,
    name: "Landing Page",
    price: "997",
    desc: "Perfeito para vendas de infoprodutos, paginas de captura ou lançamento único.",
    features: [
      "Página única (Single Page)",
      "Design focado em conversão",
      "Copywriting otimizado",
      "Integração com WhatsApp e Email",
      "Hospedagem inclusa (1º ano)",
      "Prazo de entrega: 7 dias",
    ],
    popular: false,
  },
  {
    icon: Layout,
    name: "Site Institucional",
    price: "1.997",
    desc: "A melhor escolha para empresas e negócios locais criarem autoridade online.",
    features: [
      "Até 5 páginas internas (Home, Sobre, etc.)",
      "Formulário avançado de contato",
      "SEO Técnico otimizado (Google)",
      "Integração com ferramentas externas",
      "Painel para edição de conteúdo",
      "Prazo de entrega: 15 dias",
    ],
    popular: true,
  },
  {
    icon: ShieldCheck,
    name: "E-commerce Completo",
    price: "3.497",
    desc: "Para marcas que querem vender online com catálogo e checkouts próprios.",
    features: [
      "Loja completa com até 50 produtos base",
      "Gateways de Pagamento (Mercado Pago, Stripe, etc)",
      "Gestão de estoque e envio",
      "Recuperação de carrinho abandonado",
      "Treinamento de uso ao entregar",
      "Prazo de entrega: 25 dias",
    ],
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pacotes" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <p className="text-sm font-medium text-primary tracking-wider uppercase mb-3">Serviços de Criação</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Desenvolvimento de Sites e Lojas
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Trabalhamos com preços transparentes e soluções completas para tirar sua ideia do papel e colocar na internet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative flex flex-col p-8 rounded-2xl border transition-all duration-300 ${
                pkg.popular
                  ? "bg-card border-primary/50 shadow-[0_0_40px_rgba(var(--primary),0.1)] scale-100 md:scale-105 z-10"
                  : "bg-card/50 border-border hover:border-primary/30"
              }`}
            >
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
                  Mais Popular
                </div>
              )}

              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                  <pkg.icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">{pkg.name}</h3>
                <p className="text-muted-foreground text-sm h-10">{pkg.desc}</p>
              </div>

              <div className="mb-6 pb-6 border-b border-border">
                <div className="flex items-baseline gap-1">
                  <span className="text-muted-foreground font-medium">R$</span>
                  <span className="text-4xl font-bold text-foreground">{pkg.price}</span>
                  {/* <span className="text-muted-foreground text-sm">/projeto</span> */}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Pagamento facilitado em até 12x.</p>
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-foreground/80">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span className="leading-snug">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={pkg.popular ? "default" : "outline"}
                className={`w-full gap-2 ${pkg.popular ? "h-12 text-base" : "h-11"}`}
                onClick={() => {
                  window.open(
                    `https://wa.me/5511999999999?text=Olá, gostaria de saber mais sobre o pacote de ${pkg.name}!`,
                    '_blank'
                  );
                }}
              >
                Quero este projeto
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
