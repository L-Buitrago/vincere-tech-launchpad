import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"
import Stripe from 'https://esm.sh/stripe@14.17.0?target=deno'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')

  if (!signature) {
    return new Response('Sem assinatura da Stripe', { status: 400 })
  }

  try {
    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    
    // Verify the webhook signature
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider
    )

    // Setup Supabase Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const amount = (session.amount_total || 0) / 100
      const email = session.customer_details?.email
      const name = session.customer_details?.name || 'Cliente Stripe'
      const phone = session.customer_details?.phone || null

      if (email) {
        // Upsert customer as Ativo in the CRM
        const { error } = await supabase.from('customers').upsert({
          email: email,
          name: name,
          phone: phone,
          total_spent: amount,
          status: 'Cliente Ativo',
          last_order_date: new Date().toISOString()
        }, { onConflict: 'email' })

        if (error) {
          console.error("Erro ao salvar cliente no Supabase CRM:", error)
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }
})
