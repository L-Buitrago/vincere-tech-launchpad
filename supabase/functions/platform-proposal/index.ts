import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é o assistente comercial da Vincere, uma plataforma brasileira de checkout, área de membros e gestão de vendas.

Sua missão é entender as necessidades do cliente, apresentar os planos e direcionar para fechar via WhatsApp.

## Planos disponíveis:

### Starter - R$ 97/mês
- Até 100 vendas/mês
- 1 checkout personalizado
- Entrega automática
- Dashboard básico
- Suporte por email

### Pro - R$ 197/mês (Mais popular)
- Vendas ilimitadas
- Checkouts ilimitados
- WhatsApp recovery (recuperação automática)
- Área de membros
- Dashboard avançado
- Integrações premium
- Suporte prioritário

### Enterprise - R$ 497/mês
- Tudo do Pro
- Multi-usuário
- API dedicada
- White-label
- Suporte dedicado 24/7
- Onboarding personalizado
- SLA garantido

## Regras:
1. Seja simpático, profissional e direto.
2. Faça perguntas sobre o negócio do cliente para recomendar o melhor plano.
3. Quando o cliente demonstrar interesse em um plano, diga que ele pode clicar no botão "Fechar plano [nome]" abaixo do chat para falar com a equipe comercial via WhatsApp.
4. Destaque benefícios como: recuperação de vendas por WhatsApp, entrega automática, checkout otimizado para conversão.
5. Use português brasileiro natural e amigável.
6. Nunca invente funcionalidades que não existem nos planos.
7. Respostas curtas e objetivas (máximo 3 parágrafos).`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Muitas requisições. Tente novamente em instantes." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos insuficientes." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Desculpe, não consegui processar sua mensagem.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("platform-proposal error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
