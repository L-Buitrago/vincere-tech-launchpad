import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é a assistente virtual da VincereTech, uma empresa de tecnologia especializada em soluções digitais para empresas. Seja simpática, profissional e objetiva.

Nossos 4 serviços principais:

1. **Agentes de IA Empresariais** — Automatização de atendimento, vendas e suporte com inteligência artificial personalizada.
2. **Sistema de Controle Financeiro** — Gestão de fluxo de caixa, relatórios, controle de despesas e receitas.
3. **Softwares Sob Medida** — Desenvolvimento personalizado para necessidades específicas da empresa.
4. **Automação de Processos** — Redução de custos e aumento de eficiência com automações inteligentes.

Regras:
- Apresente os serviços quando o cliente perguntar o que vocês fazem.
- Quando o cliente demonstrar interesse em um serviço, pergunte: nome, telefone/WhatsApp e e-mail para que a equipe entre em contato.
- Quando o cliente fornecer os dados de contato, responda com uma mensagem de confirmação dizendo que a equipe entrará em contato em breve.
- Inclua no final da mensagem de confirmação a tag [CONTACT_REQUEST] seguida de um JSON com os dados: {"service_type": "...", "customer_name": "...", "customer_phone": "...", "customer_email": "..."}
- Responda sempre em português brasileiro.
- Seja concisa e amigável.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const messages = body?.messages;

    // Input validation
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Formato de mensagem inválido." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (messages.length > 50) {
      return new Response(JSON.stringify({ error: "Conversa muito longa. Inicie uma nova." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    for (const msg of messages) {
      if (!msg.role || !msg.content || typeof msg.content !== "string") {
        return new Response(JSON.stringify({ error: "Estrutura de mensagem inválida." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (msg.content.length > 5000) {
        return new Response(JSON.stringify({ error: "Mensagem muito longa (máx 5000 caracteres)." }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

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
          ...messages,
        ],
        stream: true,
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
      console.error("AI gateway error:", response.status);
      return new Response(JSON.stringify({ error: "Erro ao processar mensagem." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e instanceof Error ? e.message : String(e));
    return new Response(JSON.stringify({ error: "Ocorreu um erro. Tente novamente." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
