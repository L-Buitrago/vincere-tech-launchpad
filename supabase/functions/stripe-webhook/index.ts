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
    
    const event = await stripe.webhooks.constructEventAsync(
      body, signature, webhookSecret, undefined, cryptoProvider
    )

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const amount = (session.amount_total || 0) / 100
      const email = session.customer_details?.email
      const name = session.customer_details?.name || 'Cliente Stripe'
      const phone = session.customer_details?.phone || null
      const stripeCustomerId = session.customer || null

      if (email) {
        // 1. Create or find the organization for this customer
        let orgId: string | null = null

        // Check if org already exists for this email
        const { data: existingOrg } = await supabase
          .from('organizations')
          .select('id')
          .eq('owner_email', email)
          .maybeSingle()

        if (existingOrg) {
          orgId = existingOrg.id
        } else {
          // Create new organization
          const { data: newOrg, error: orgError } = await supabase
            .from('organizations')
            .insert({
              name: `Empresa de ${name}`,
              owner_email: email,
              stripe_customer_id: stripeCustomerId,
              plan: 'starter',
              status: 'active',
            })
            .select('id')
            .single()

          if (orgError) {
            console.error("Erro ao criar organização:", orgError)
          } else {
            orgId = newOrg.id
          }
        }

        // 2. Link user to org (find user by email)
        if (orgId) {
          const { data: authUser } = await supabase.auth.admin.listUsers()
          const matchingUser = authUser?.users?.find(u => u.email === email)
          
          if (matchingUser) {
            await supabase.from('org_members').upsert({
              org_id: orgId,
              user_id: matchingUser.id,
              role: 'owner',
            }, { onConflict: 'org_id,user_id' })
          }
        }

        // 3. Upsert customer in CRM linked to the org
        const { error } = await supabase.from('customers').upsert({
          email: email,
          name: name,
          phone: phone,
          total_spent: amount,
          status: 'Cliente Ativo',
          last_order_date: new Date().toISOString(),
          org_id: orgId,
        }, { onConflict: 'email' })

        if (error) {
          console.error("Erro ao salvar cliente no CRM:", error)
        }

        // 4. Send welcome email
        try {
          const emailUrl = `${supabaseUrl}/functions/v1/send-welcome-email`
          await fetch(emailUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseServiceKey}`,
            },
            body: JSON.stringify({
              customerName: name,
              customerEmail: email,
              planName: 'Starter',
            }),
          })
        } catch (emailErr) {
          console.error("Welcome email error (non-blocking):", emailErr)
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }
})
