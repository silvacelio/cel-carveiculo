# 🚗 Cel-Car — Funilaria e Pintura

Site institucional + assistente virtual + wizard de orçamentos + painel administrativo para a **Cel-Car Funilaria e Pintura**, oficina do Célio Evangelista em Inhaúma, Rio de Janeiro.

## ✨ Funcionalidades

- **Site vitrine completo** (Hero, Sobre, Como Funciona, Serviços, Galeria antes/depois, Depoimentos, FAQ, Contato)
- **Assistente Virtual 24/7** com LLM (Z.ai) seguindo a persona oficial da Cel-Car
- **Wizard de Orçamento em 5 etapas** com upload de fotos
- **Painel administrativo** (`/admin`) para gerenciar orçamentos recebidos
- **SEO otimizado** com Schema.org LocalBusiness + OpenGraph
- **100% responsivo** (mobile-first)
- **Acessível** (ARIA, semantic HTML, keyboard navigation)

## 🛠 Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Estilo:** Tailwind CSS 4 + shadcn/ui
- **Banco de dados:** PostgreSQL (Supabase em produção, SQLite em dev)
- **ORM:** Prisma
- **LLM:** Z.ai SDK (`z-ai-web-dev-sdk`)
- **Animações:** Framer Motion

## 📋 Pré-requisitos

- Node.js 18+ ou Bun
- Conta no [Supabase](https://supabase.com) (gratuita)
- Conta na [Z.ai](https://z.ai) para a API key do assistente virtual (opcional — site funciona sem, mas o chatbot fica em modo fallback)
- Conta no GitHub + Vercel para deploy

## 🚀 Deploy na Vercel (passo a passo)

### Passo 1: Subir o código no GitHub

```bash
# Inicialize o git (se ainda não fez)
git init
git add .
git commit -m "Cel-Car — site completo"

# Crie um repositório no GitHub e faça o push
git remote add origin https://github.com/SEU_USUARIO/cel-car.git
git push -u origin main
```

> ⚠️ **IMPORTANTE:** Antes do commit, restaure o schema de produção:
> ```bash
> # O schema.prisma em produção deve ser o PostgreSQL (Supabase)
> # Veja a seção "Schema do banco (importante)" abaixo
> ```

### Passo 2: Configurar o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie uma conta (ou faça login)
2. Clique em **New Project**
3. Preencha:
   - **Name:** Cel-Car
   - **Database Password:** crie uma senha forte e **anote** (vai precisar)
   - **Region:** South America (São Paulo) — mais perto do Brasil
   - **Plan:** Free
4. Aguarde 2-3 minutos para o projeto ser provisionado
5. Vá em **Project Settings → Database → Connection string**
6. Você verá **duas URLs**:
   - **Transaction** (com `pooler` na URL, porta `6543`) → use como `DATABASE_URL`
   - **Session** (sem `pooler`, porta `5432`) → use como `DIRECT_URL`
7. Substitua `[YOUR-PASSWORD]` pela senha que você anotou no passo 3

### Passo 3: Importar o projeto na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **Add New → Project**
3. Selecione o repositório `cel-car`
4. A Vercel detecta Next.js automaticamente — não mude nada nas settings
5. **Antes de clicar em Deploy**, expanda **Environment Variables** e adicione:

   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | `postgresql://postgres.[REF]:[SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
   | `DIRECT_URL` | `postgresql://postgres.[REF]:[SENHA]@aws-0-sa-east-1.supabase.com:5432/postgres` |
   | `ADMIN_PASSWORD` | uma senha forte de sua escolha (ex: `Cel-Car@2026!`) |
   | `ZAI_API_KEY` | sua API key da Z.ai (pegue em [z.ai](https://z.ai)) |

6. Clique em **Deploy**
7. Aguarde 2-3 minutos — a Vercel vai instalar dependências e fazer o build

### Passo 4: Criar as tabelas no Supabase

Após o primeiro deploy, você precisa criar as tabelas. **Duas opções:**

**Opção A: Via Prisma Migrate (recomendado)**

Rode localmente:
```bash
# Restaure o schema de produção (Postgres)
# (veja a seção abaixo — basicamente copie schema.prod.prisma para schema.prisma)

# Configure .env.local com as URLs do Supabase
DATABASE_URL="postgresql://postgres.[REF]:[SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[SENHA]@aws-0-sa-east-1.supabase.com:5432/postgres"

# Rode a migração
bun run db:push
```

**Opção B: Via SQL direto no Supabase**

1. No painel do Supabase → **SQL Editor**
2. Cole este SQL e rode:

```sql
CREATE TABLE "QuoteLead" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "vehicle" TEXT,
    "plate" TEXT,
    "year" TEXT,
    "damageType" TEXT,
    "parts" TEXT,
    "description" TEXT,
    "photos" TEXT,
    "status" TEXT DEFAULT 'novo',
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "ChatLead" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT,
    "vehicle" TEXT,
    "part" TEXT,
    "message" TEXT NOT NULL,
    "phone" TEXT,
    "channel" TEXT DEFAULT 'chat',
    "handled" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "QuoteLead_status_idx" ON "QuoteLead"("status");
CREATE INDEX "QuoteLead_createdAt_idx" ON "QuoteLead"("createdAt");
CREATE INDEX "ChatLead_createdAt_idx" ON "ChatLead"("createdAt");
CREATE INDEX "ChatLead_handled_idx" ON "ChatLead"("handled");
```

### Passo 5: Testar

- Site: `https://cel-car.vercel.app` (ou o domínio que a Vercel gerou)
- Painel admin: `https://cel-car.vercel.app/admin` (use a senha que você definiu em `ADMIN_PASSWORD`)
- Faça um orçamento de teste pelo site → entre no admin → veja se aparece na lista

### Passo 6: Configurar domínio próprio (opcional)

Na Vercel: **Settings → Domains** → adicione `celcar.com.br` (ou o que você tiver) e siga as instruções de DNS.

## 🔄 Schema do banco (importante)

Este repositório tem **dois schemas Prisma**:

| Arquivo | Provider | Quando usar |
|---------|----------|-------------|
| `prisma/schema.prisma` | PostgreSQL | **Produção** (Vercel + Supabase) |
| `prisma/schema.dev.prisma` | SQLite | **Dev local** |

**Antes de commitar para o GitHub/Vercel**, garanta que `schema.prisma` é o PostgreSQL. Se você está em dev local com SQLite, faça:

```bash
# Antes de commitar:
cp prisma/schema.prod.prisma schema.prisma  # (crie schema.prod.prisma conforme abaixo)
# OU restaure manualmente o schema de Postgres

# Para voltar a dev local:
cp prisma/schema.dev.prisma prisma/schema.prisma
bun run db:push
```

> 💡 **Dica:** Você pode manter o `schema.prisma` sempre como PostgreSQL e usar SQLite só criando um `prisma/schema.dev.prisma` separado — o Prisma suporta multi-schema via a flag `--schema`.

## 🧪 Desenvolvimento local

```bash
# Instalar dependências
bun install

# Configurar ambiente dev
cp .env.example .env.local
# Edite .env.local com:
#   DATABASE_URL="file:./dev.db"  (SQLite para dev)
#   ADMIN_PASSWORD="celcar2026"
#   ZAI_API_KEY=... (opcional em dev)

# Usar schema SQLite em dev
cp prisma/schema.dev.prisma prisma/schema.prisma
bun run db:push

# Rodar o dev server
bun run dev
```

Acesse: http://localhost:3000

## 📁 Estrutura do projeto

```
src/
├── app/
│   ├── page.tsx              # Home (todas as seções)
│   ├── layout.tsx            # Layout raiz + JSON-LD
│   ├── admin/page.tsx        # Painel administrativo
│   └── api/
│       ├── chat/route.ts     # Endpoint do assistente virtual (Z.ai)
│       ├── quote/route.ts    # CRUD de orçamentos (Prisma)
│       └── upload/route.ts   # Upload de fotos
├── components/
│   ├── ui/                   # shadcn/ui components
│   └── site/
│       ├── header.tsx
│       ├── hero.tsx
│       ├── about.tsx
│       ├── how-it-works.tsx
│       ├── services.tsx
│       ├── gallery.tsx
│       ├── testimonials.tsx
│       ├── faq.tsx
│       ├── contact.tsx
│       ├── footer.tsx
│       ├── chat-widget.tsx   # Assistente virtual flutuante
│       └── quote-wizard.tsx  # Wizard de orçamento (5 etapas)
└── lib/
    ├── db.ts                 # Prisma client
    ├── utils.ts              # Helpers (cn)
    └── site-data.ts          # Dados da oficina (editável)
```

## ✏️ Personalização

### Trocar fotos da galeria
Edite `src/lib/site-data.ts` → `GALLERY_ITEMS` → troque as URLs de `before` e `after` por suas fotos reais.

### Trocar depoimentos
Edite `src/lib/site-data.ts` → `TESTIMONIALS`.

### Atualizar horário de atendimento
Edite `src/lib/site-data.ts` → `SITE_CONFIG.hours`.

### Trocar senha do admin
- **Dev:** edite `.env.local` → `ADMIN_PASSWORD`
- **Produção:** edite a variável de ambiente na Vercel

## 🔒 Segurança

- **Painel admin:** protegido por senha simples (sessionStorage). Para produção com autenticação real, considere NextAuth.js.
- **Upload de fotos:** validação de MIME type (JPG/PNG/WEBP) e tamanho (5MB).
- **APIs:** validação de input server-side.
- **API key Z.ai:** apenas server-side, nunca exposta ao cliente.

## 📞 Contato da oficina

- **Célio Evangelista** — Responsável técnico
- **WhatsApp:** (21) 97708-6841
- **E-mail:** celio_e_v@hotmail.com
- **Endereço:** Rua José dos Reis, 2047 — Inhaúma — Rio de Janeiro — CEP 20760-245
- **CNPJ:** 35.497.152/0001-26

---

Feito com dedicação no Rio de Janeiro. 🇧🇷
