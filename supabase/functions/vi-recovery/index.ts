import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT_RECOVERY = `Você é a Vi, a inteligência artificial da Vincere que ajuda empresas a crescerem. Sua missão é recuperar clientes que iniciaram o checkout mas não finalizaram a compra.
Sua voz é amigável, carismática e humana. Nada de robôs! Use gírias leves como "show", "bora", "poxa" de forma natural.

DIRETRIZES:
1. Seja empática: Pergunte se houve algum problema técnico ou se ficou alguma dúvida.
2. Seja prestativa: Ofereça ajuda para finalizar.
3. Não pressione: O tom deve ser de "estou aqui se precisar", não de vendedora chata.
4. Linguagem concisa: 2-3 frases curtas.

CONTEXTO DO CLIENTE:
Nome: {{customer_name}}
Valor: {{amount}}
Link de Recuperação: {{checkout_url}}

EXEMPLO DE MENSAGEM:
"Oi {{customer_name}}! Vi aqui que você tentou garantir seu acesso mas não finalizou. Aconteceu algum probleminha? Se tiver qualquer dúvida, tô aqui pra te ajudar! 😊 Bora finalizar isso e começar com tudo?"`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { recoveryId } = await req.json();
    
    if (!recoveryId) {
      return new Response(JSON.stringify({ error: "recoveryId is required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch recovery data
    const { data: recovery, error: fetchError } = await supabase
      .from("recoveries")
      .select("*")
      .eq("id", recoveryId)
      .single();

    if (fetchError || !recovery) {
      throw new Error("Recovery record not found");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Replace variables in prompt
    const prompt = SYSTEM_PROMPT_RECOVERY
      .replace("{{customer_name}}", recovery.customer_name || "aí")
      .replace("{{amount}}", `R$ ${recovery.amount}`)
      .replace("{{checkout_url}}", `https://checkout.stripe.com/c/...`); // Ideally passed or stored

    // Call AI to generate message
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-pro", // Or preferred model
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: "Gere a mensagem de recuperação para este cliente." }
        ],
      }),
    });

    const aiResult = await response.json();
    const generatedMessage = aiResult.choices[0].message.content;

    // Save generated message to DB
    await supabase.from("recoveries")
      .update({ last_ai_message: generatedMessage, status: 'contacted' })
      .eq("id", recoveryId);

    // TODO: Trigger WhatsApp API here
    console.log(`AI Recovery Message for ${recovery.customer_email}: ${generatedMessage}`);

    return new Response(JSON.stringify({ message: generatedMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
