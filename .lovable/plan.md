

# Correcao de Seguranca — Restringir Acesso a Usuarios Autenticados

## Problema

As politicas RLS nas tabelas `profiles`, `quotes` e `projects` nao especificam o role `authenticated`. Isso significa que, por padrao, o role `anon` (usuarios nao logados) tambem pode tentar acessar essas tabelas. Embora a condicao `auth.uid() = user_id` impeca acesso real (pois `auth.uid()` retorna NULL para usuarios anonimos), a pratica recomendada e restringir explicitamente ao role `authenticated`.

## Solucao

Criar uma nova migracao SQL que:

1. Remove todas as politicas RLS existentes nas 3 tabelas (`profiles`, `quotes`, `projects`)
2. Recria as mesmas politicas adicionando `TO authenticated` em cada uma

### Politicas afetadas

**profiles (3 politicas):**
- SELECT, UPDATE, INSERT — adicionar `TO authenticated`

**quotes (4 politicas):**
- SELECT, INSERT, UPDATE, DELETE — adicionar `TO authenticated`

**projects (4 politicas):**
- SELECT, INSERT, UPDATE, DELETE — adicionar `TO authenticated`

## Migracao SQL

Uma unica migracao que:

```text
-- Drop all existing policies
DROP POLICY "Users can view own profile" ON public.profiles;
DROP POLICY "Users can update own profile" ON public.profiles;
DROP POLICY "Users can insert own profile" ON public.profiles;

DROP POLICY "Users can view own quotes" ON public.quotes;
DROP POLICY "Users can insert own quotes" ON public.quotes;
DROP POLICY "Users can update own quotes" ON public.quotes;
DROP POLICY "Users can delete own quotes" ON public.quotes;

DROP POLICY "Users can view own projects" ON public.projects;
DROP POLICY "Users can insert own projects" ON public.projects;
DROP POLICY "Users can update own projects" ON public.projects;
DROP POLICY "Users can delete own projects" ON public.projects;

-- Recreate with TO authenticated
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own quotes" ON public.quotes
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quotes" ON public.quotes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quotes" ON public.quotes
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own quotes" ON public.quotes
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
```

## Impacto

- Zero impacto na funcionalidade existente (usuarios logados continuam acessando normalmente)
- Elimina qualquer possibilidade de acesso pelo role `anon`
- Resolve os 2 alertas de seguranca reportados

## Arquivos

| Acao | Arquivo |
|------|---------|
| SQL | Nova migracao para recriar politicas RLS com `TO authenticated` |

Nenhuma alteracao no codigo frontend e necessaria.
