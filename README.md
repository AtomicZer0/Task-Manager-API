# 📝 Task Manager

Aplicação fullstack de gerenciamento de tarefas com operações completas de criação, listagem, filtragem, paginação, atualização e exclusão.

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Backend | NestJS + TypeORM |
| Frontend | Next.js 15 + Tailwind CSS |
| Banco de Dados | PostgreSQL 16 |
| Containerização | Docker + Docker Compose |

## 📁 Estrutura do Projeto

```
/
├── docker-compose.yml
├── README.md
├── database/
│   └── init.sql
├── task-manager-backend/       # API REST em NestJS
└── task-manager-frontend/      # Interface em Next.js
```

## 🚀 Como Rodar

### Pré-requisitos

- [Docker](https://www.docker.com/) instalado e rodando
- [Docker Compose](https://docs.docker.com/compose/) (já incluso no Docker Desktop)

### 1. Clonar o repositório

```bash
git clone https://github.com/AtomicZer0/Task-Manager-API.git
cd task-manager
```

### 2. Subir os containers

```bash
docker compose up --build
```

Aguarde até aparecer nos logs:

```
taskmanager_backend   | [Nest] LOG Application is running on: http://[::1]:3001
taskmanager_frontend  | ▲ Next.js ready on http://localhost:3000
```

### 3. Acessar a aplicação

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |

### Parar os containers

```bash
docker compose down
```

### Resetar o banco de dados

```bash
docker compose down -v
```

---

## 🧪 Como Rodar os Testes

```bash
cd task-manager-backend
npm install - opcional
npm run test
```

Para relatório de cobertura:

```bash
npm run test:cov
```

---