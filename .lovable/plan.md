
# Plano de Implementacao — Vincere Tech Backend

## Visao Geral

Adicionar autenticacao por email/senha, painel do usuario com pedidos (orcamentos + projetos), chatbot de IA, analise de dados com IA, pagamentos via Stripe (unico + assinatura), notificacoes por email e tarefas agendadas.

---

## 1. Autenticacao (Email e Senha)

**Tabelas no Supabase:**
- `profiles` — id (FK auth.users), full_name, avatar_url, phone, created_at
- Trigger para criar perfil automaticamente ao registrar

**Paginas:**
- `/auth` — formulario de login e cadastro (tabs)
- `/dashboard` — painel do usuario (rota protegida)
- `/reset-password` — redefinicao de senha

**Componentes:**
- `AuthProvider` com contexto de sessao usando `onAuthStateChange`
- `ProtectedRoute` wrapper para rotas autenticadas
- Botao de login/logout no Navbar

---

## 2. Pedidos (Orcamentos + Projetos)

**Tabelas:**
- `quotes` — id, user_id, service_type, description, status (pending/approved/rejected), created_at
- `projects` — id, user_id, quote_id (opcional), title, description, status (in_progress/completed/paused), start_date, end_date, created_at

**RLS:** usuarios veem apenas seus proprios registros.

**No Dashboard:**
- Aba "Orcamentos" — listar, solicitar novo orcamento
- Aba "Projetos" — listar projetos com status e progresso

---

## 3. Chatbot de IA (Atendimento)

**Edge Function:** `chat` — usa Lovable AI Gateway (google/gemini-3-flash-preview)
- Prompt de sistema configurado como assistente da Vincere Tech
- Streaming SSE para respostas em tempo real
- Tratamento de erros 429/402

**Frontend:**
- Componente de chat flutuante (widget no canto inferior direito)
- Renderizacao de markdown com react-markdown
- Historico de conversa na sessao

---

## 4. Analise de Dados com IA

**Edge Function:** `analyze-data` — recebe dados do usuario e retorna insights
- Analisa metricas de projetos e orcamentos do usuario
- Retorna resumo e sugestoes via Lovable AI Gateway

**No Dashboard:**
- Aba "Insights" — mostra analise gerada pela IA sobre seus projetos/orcamentos
- Graficos com Recharts para visualizacao

---

## 5. Pagamentos com Stripe

**Integracao:**
- Habilitar Stripe via ferramenta integrada do Lovable
- Suportar pagamento unico (por projeto) e assinaturas mensais

**Edge Functions:**
- `create-checkout` — cria sessao de checkout Stripe
- `stripe-webhook` — processa eventos do Stripe (pagamento confirmado, assinatura atualizada)

**Tabela:**
- `payments` — id, user_id, stripe_session_id, amount, status, type (one_time/subscription), created_at

**No Dashboard:**
- Aba "Pagamentos" — historico e status
- Botoes para pagar projeto ou assinar plano

---

## 6. Notificacoes por Email

**Emails de autenticacao:**
- Templates customizados via `scaffold_auth_email_templates` (confirmacao, reset de senha)
- Estilizados com a identidade visual da Vincere Tech (azul escuro + prata)

**Emails transacionais (orcamento aprovado, projeto atualizado):**
- Edge function `send-notification` usando Lovable AI Gateway ou servico externo
- Disparados por triggers no banco ou chamadas da aplicacao

---

## 7. Tarefas Agendadas (Cron)

**Extensoes:** Habilitar `pg_cron` e `pg_net`

**Jobs agendados:**
- Verificar orcamentos pendentes ha mais de 7 dias e enviar lembrete
- Atualizar status de projetos com prazo vencido
- Gerar relatorio semanal de insights por IA

**Implementacao:** SQL cron jobs chamando edge functions via `net.http_post`

---

## Ordem de Implementacao

1. Autenticacao + Profiles (base para tudo)
2. Tabelas de quotes e projects + Dashboard
3. Chatbot de IA (edge function + widget)
4. Analise de dados com IA
5. Stripe (habilitar + checkout + webhook)
6. Email templates customizados
7. Cron jobs para tarefas agendadas

---

## Detalhes Tecnicos

- **Banco:** 4 tabelas novas (profiles, quotes, projects, payments) com RLS
- **Edge Functions:** 4-5 funcoes (chat, analyze-data, create-checkout, stripe-webhook, send-notification)
- **Rotas:** /auth, /dashboard, /reset-password
- **Bibliotecas novas:** react-markdown (para chatbot)
- **Stripe:** habilitado via ferramenta integrada do Lovable
- **Cron:** pg_cron + pg_net para agendamento
