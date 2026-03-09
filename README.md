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
git clone https://github.com/seu-usuario/task-manager.git
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
| API | http://localhost:3001 |

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
npm install
npm run test
```

Para relatório de cobertura:

```bash
npm run test:cov
```

---

## 📡 Endpoints da API

Base URL: `http://localhost:3001`

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/tasks` | Criar tarefa |
| `GET` | `/tasks` | Listar tarefas |
| `GET` | `/tasks?status=pending` | Filtrar por status |
| `GET` | `/tasks?page=1&limit=10` | Paginação |
| `GET` | `/tasks/:id` | Buscar por ID |
| `PUT` | `/tasks/:id` | Atualizar tarefa |
| `DELETE` | `/tasks/:id` | Deletar tarefa |

### Campos da tarefa

| Campo | Tipo | Obrigatório | Valores aceitos |
|---|---|---|---|
| `title` | string | ✅ | qualquer texto |
| `description` | string | ❌ | qualquer texto |
| `status` | string | ✅ | `pending`, `in_progress`, `done` |

### Exemplos de requisição

**Criar tarefa:**
```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Estudar NestJS","description":"Revisar DTOs","status":"pending"}'
```

**Listar tarefas pendentes:**
```bash
curl http://localhost:3001/tasks?status=pending
```

**Atualizar status:**
```bash
curl -X PUT http://localhost:3001/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'
```

**Deletar tarefa:**
```bash
curl -X DELETE http://localhost:3001/tasks/<id>
```

---

## 🌍 Variáveis de Ambiente

O projeto usa as seguintes variáveis, já configuradas no `docker-compose.yml`:

| Variável | Valor padrão | Descrição |
|---|---|---|
| `DB_HOST` | `db` | Host do banco de dados |
| `DB_PORT` | `5432` | Porta do PostgreSQL |
| `DB_USERNAME` | `taskuser` | Usuário do banco |
| `DB_PASSWORD` | `suasenha` | Senha do banco |
| `DB_NAME` | `taskdb` | Nome do banco |
