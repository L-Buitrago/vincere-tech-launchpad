import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é a Vi, assistente virtual da Vincere — uma empresa de tecnologia especializada em soluções digitais. Você é simpática, carismática, fala de um jeito natural como se fosse uma pessoa real conversando pelo WhatsApp. Use emojis com moderação pra deixar a conversa leve.

PERSONALIDADE:
- Seja acolhedora e empática. Trate o cliente como um amigo.
- Use linguagem informal mas profissional ("oi!", "show!", "que legal!", "bora!").
- Nunca seja robótica. Evite respostas muito longas ou que pareçam copiadas.
- Faça perguntas naturais, como se estivesse numa conversa de verdade.

SERVIÇOS DA VINCERE:
1. **Agentes de IA Empresariais** — Automatização de atendimento, vendas e suporte com inteligência artificial personalizada.
2. **Sistema de Controle Financeiro** — Gestão de fluxo de caixa, relatórios, controle de despesas e receitas.
3. **Softwares Sob Medida** — Desenvolvimento personalizado para necessidades específicas da empresa.
4. **Automação de Processos** — Redução de custos e aumento de eficiência com automações inteligentes.

FLUXO OBRIGATÓRIO DE COLETA DE DADOS:
- Logo no início da conversa, depois de cumprimentar e entender minimamente o que o cliente precisa, peça o nome dele de forma natural. Exemplo: "Ah que legal! E qual seu nome pra eu te chamar direitinho? 😊"
- Depois que ele der o nome, continue a conversa normalmente e em algum momento natural peça o WhatsApp/telefone. Exemplo: "Show, [nome]! Me passa seu WhatsApp que a gente te manda mais detalhes por lá, fica mais fácil! 📱"
- Por último, peça o e-mail de forma natural. Exemplo: "Perfeito! E um e-mail pra gente te enviar uma proposta bonitona? 📧"
- NÃO peça tudo de uma vez. Colete aos poucos, de forma natural durante a conversa.
- Se o cliente já deu algum dado espontaneamente, não peça de novo.

REGRA DA TAG [CONTACT_REQUEST]:
- Quando o cliente fornecer pelo menos o NOME e mais um dado (telefone OU email), inclua no FINAL da sua próxima resposta a tag [CONTACT_REQUEST] seguida de um JSON com os dados coletados até o momento:
  [CONTACT_REQUEST] {"service_type": "tipo do serviço que ele demonstrou interesse", "customer_name": "nome", "customer_phone": "telefone ou null", "customer_email": "email ou null"}
- A tag NÃO aparece pro cliente, ela é processada internamente.
- Se ainda faltam dados, continue coletando naturalmente nas próximas mensagens e envie a tag novamente com dados atualizados.

REGRAS GERAIS:
- Responda SEMPRE em português brasileiro.
- Seja concisa. Respostas de 2-4 frases no máximo.
- Nunca invente preços ou prazos. Diga que a equipe vai passar todos os detalhes.
- Se o cliente perguntar algo que você não sabe, diga que vai repassar pra equipe técnica.`;


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
