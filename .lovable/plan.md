

# Implementacao — Autenticacao + Profiles + Dashboard

## Resumo

Criar toda a infraestrutura de autenticacao com email/senha, incluindo banco de dados (profiles, quotes, projects), contexto de autenticacao, paginas de login/cadastro, dashboard com abas e rotas protegidas.

---

## 1. Migracao SQL (Supabase)

Criar uma unica migracao com:

### Tabelas
- **profiles** — `id` (uuid PK default gen_random_uuid()), `user_id` (uuid FK auth.users NOT NULL UNIQUE, ON DELETE CASCADE), `full_name` (text), `avatar_url` (text), `phone` (text), `created_at` (timestamptz default now())
- **quotes** — `id` (uuid PK), `user_id` (uuid FK auth.users NOT NULL), `service_type` (text NOT NULL), `description` (text), `status` (text default 'pending'), `created_at` (timestamptz default now())
- **projects** — `id` (uuid PK), `user_id` (uuid FK auth.users NOT NULL), `quote_id` (uuid FK quotes, nullable), `title` (text NOT NULL), `description` (text), `status` (text default 'in_progress'), `start_date` (date), `end_date` (date), `created_at` (timestamptz default now())

### Trigger
- Funcao `handle_new_user()` que cria automaticamente um registro em `profiles` quando um usuario se cadastra
- Trigger `on_auth_user_created` em `auth.users` AFTER INSERT

### RLS
- Habilitar RLS nas 3 tabelas
- Politicas: usuarios so veem/editam/deletam seus proprios registros (`auth.uid() = user_id`)
- INSERT: apenas usuarios autenticados, com `WITH CHECK (auth.uid() = user_id)`

---

## 2. Contexto de Autenticacao

### `src/contexts/AuthContext.tsx`
- Cria contexto React com `user`, `session`, `loading`, `signOut`
- Usa `onAuthStateChange` para monitorar sessao (configurado ANTES de `getSession`)
- Exporta hook `useAuth()`

### `src/components/ProtectedRoute.tsx`
- Wrapper que redireciona para `/auth` se usuario nao estiver logado
- Mostra loading spinner enquanto verifica sessao

---

## 3. Paginas

### `/auth` — `src/pages/Auth.tsx`
- Tabs: **Login** e **Cadastro**
- Login: email + senha, botao "Entrar", link "Esqueci minha senha"
- Cadastro: nome, email, senha, botao "Criar Conta"
- `signUp` com `emailRedirectTo: window.location.origin`
- `resetPasswordForEmail` com `redirectTo` para `/reset-password`
- Redireciona para `/dashboard` se ja logado

### `/reset-password` — `src/pages/ResetPassword.tsx`
- Formulario para nova senha
- Verifica `type=recovery` no hash da URL
- Chama `updateUser({ password })`

### `/dashboard` — `src/pages/Dashboard.tsx`
- Rota protegida via `ProtectedRoute`
- Header com nome do usuario e botao de logout
- Tabs usando componente Tabs do shadcn:
  - **Orcamentos** — lista de orcamentos do usuario + botao para solicitar novo
  - **Projetos** — lista de projetos com status
- Dados carregados via `@tanstack/react-query` com queries ao Supabase

---

## 4. Atualizacoes Existentes

### `src/App.tsx`
- Envolver app com `AuthProvider`
- Adicionar rotas: `/auth`, `/dashboard`, `/reset-password`
- Dashboard envolvido em `ProtectedRoute`

### `src/components/Navbar.tsx`
- Adicionar botao "Entrar" / "Meu Painel" condicional baseado na sessao
- Se logado: botao "Meu Painel" linka para `/dashboard`
- Se nao logado: botao "Entrar" linka para `/auth`

---

## Arquivos a Criar/Editar

| Acao   | Arquivo |
|--------|---------|
| Criar  | `src/contexts/AuthContext.tsx` |
| Criar  | `src/components/ProtectedRoute.tsx` |
| Criar  | `src/pages/Auth.tsx` |
| Criar  | `src/pages/ResetPassword.tsx` |
| Criar  | `src/pages/Dashboard.tsx` |
| Editar | `src/App.tsx` |
| Editar | `src/components/Navbar.tsx` |
| SQL    | Migracao: profiles + quotes + projects + trigger + RLS |

---

## Detalhes Tecnicos

- Nenhuma biblioteca nova necessaria (shadcn Tabs, react-router-dom e @tanstack/react-query ja estao instalados)
- Supabase Auth ja esta disponivel via `supabase.auth`
- Tipos do Supabase serao atualizados automaticamente apos a migracao
- Todas as queries usam `supabase.from('table').select()` com filtro automatico via RLS
