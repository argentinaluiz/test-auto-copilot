# Agentes Autônomos com GitHub Copilot

Este repositório contém o projeto desenvolvido durante a aula de **Agentes Autônomos com GitHub Copilot**. Trata-se de uma aplicação Express.js com TypeScript seguindo os princípios de **Clean Architecture** e padrões SOLID.

---

## 📋 Pré-requisitos

- Docker
- Node.js v16+
- npm

## 🚀 Instalação

```bash
# Clonar o repositório
git clone https://github.com/argentinaluiz/test-auto-copilot.git
cd test-auto-copilot

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

## 🐳 Configuração do Banco de Dados

O projeto utiliza PostgreSQL via Docker e Prisma como ORM.

```bash
# Iniciar container PostgreSQL
npm run docker:up

# Gerar Prisma Client
npm run prisma:generate

# Executar migrations
npm run prisma:migrate
```

## ▶️ Executando a Aplicação

### Desenvolvimento

```bash
npm run dev
```

O servidor será iniciado em `http://localhost:3000` (usa `ts-node` diretamente, sem hot reload).

### Produção

```bash
npm run build
npm start
```

## 🛠️ Estrutura do Projeto

```
express-typescript-app/
├── src/
│   ├── app.ts                    # Configuração do Express e middlewares
│   ├── server.ts                 # Inicialização do servidor com conexão ao DB
│   ├── config/
│   │   └── database.ts           # Configuração do banco (Prisma singleton)
│   ├── controllers/
│   │   ├── index.ts              # Controller principal
│   │   └── post.controller.ts    # Controller de posts
│   ├── domain/
│   │   └── post.interface.ts     # Interfaces do domínio (entidades)
│   ├── middleware/
│   │   └── errorHandler.ts       # Middleware de tratamento de erros
│   ├── repositories/
│   │   └── post.repository.ts    # Implementação do repositório (Prisma)
│   ├── routes/
│   │   ├── index.ts              # Registro centralizado de rotas
│   │   └── posts.routes.ts       # Rotas de posts
│   ├── types/
│   │   └── index.ts              # Definições de tipos customizados
│   └── use-cases/
│       └── list-posts.use-case.ts # Caso de uso: listar posts
├── prisma/
│   ├── schema.prisma             # Schema do Prisma (modelos)
│   └── migrations/               # Arquivos de migração
├── scripts/
│   └── setup-worktree.sh         # Setup para Git Worktrees
├── docker-compose.yml            # Docker Compose para PostgreSQL
├── package.json
├── tsconfig.json
└── README.md
```

## 📚 Arquitetura (Clean Architecture)

O projeto segue a Clean Architecture com separação clara de camadas:

| Camada | Responsabilidade | Exemplo |
|--------|-----------------|---------|
| **Domain** | Entidades e regras de negócio | `post.interface.ts` |
| **Use Cases** | Orquestração de lógica de aplicação | `list-posts.use-case.ts` |
| **Interface Adapters** | Controllers e gateways | `post.controller.ts` |
| **Frameworks & Drivers** | Express, Prisma, Docker | `app.ts`, `database.ts` |

## 🔗 Endpoints Disponíveis

- `GET /` - Mensagem de boas-vindas
- `GET /health` - Health check (verifica conexão com o banco)
- `GET /api/posts` - Listar posts

## ⚙️ Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta da aplicação | `3000` |
| `NODE_ENV` | Modo do ambiente | `development` |
| `DATABASE_URL` | Connection string PostgreSQL | `postgresql://postgres:postgres@localhost:5432/express_db?schema=public` |
| `POSTGRES_USER` | Usuário PostgreSQL (Docker) | `postgres` |
| `POSTGRES_PASSWORD` | Senha PostgreSQL (Docker) | `postgres` |
| `POSTGRES_DB` | Nome do banco (Docker) | `express_db` |

## 📖 Comandos Úteis

```bash
# Docker
npm run docker:up           # Iniciar container PostgreSQL
npm run docker:down         # Parar container
npm run docker:logs         # Ver logs do PostgreSQL

# Prisma
npm run prisma:generate     # Gerar Prisma Client
npm run prisma:migrate      # Criar e aplicar migrations
npm run db:push             # Push do schema (sem migrations)
npm run prisma:studio       # Abrir GUI do banco (localhost:5555)

# Aplicação
npm run dev                 # Desenvolvimento (ts-node)
npm run build               # Compilar TypeScript
npm start                   # Executar versão compilada
npm run watch               # Watch mode para compilação
```

## 🔧 Troubleshooting

### Porta 5432 em uso

```bash
# Parar PostgreSQL local
sudo service postgresql stop
```

### Erro de conexão recusada

1. Verifique se o container está rodando: `docker ps`
2. Veja os logs: `npm run docker:logs`
3. Confirme a `DATABASE_URL` no `.env`

### Prisma Client não encontrado

```bash
npm run prisma:generate
```

