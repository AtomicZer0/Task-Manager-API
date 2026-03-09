# ⚙️ Task Manager — Backend

API REST desenvolvida com NestJS e PostgreSQL para gerenciamento de tarefas.

## 📦 Como Instalar

### Pré-requisitos

- Node.js 20+
- PostgreSQL rodando localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie o arquivo `.env` na raiz da pasta do backend:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=taskuser
DB_PASSWORD=suasenha
DB_NAME=taskdb
```

### 3. Criar o banco de dados

```bash
sudo -iu postgres psql
```

```sql
CREATE USER taskuser WITH PASSWORD 'suasenha';
CREATE DATABASE taskdb OWNER taskuser;
\q
```

---

## 🚀 Como Rodar

### Modo desenvolvimento

```bash
npm run start:dev
```

A API está disponível em [**http://localhost:3001**](http://localhost:3001)

### Rodar com Docker

Na raiz do monorepo:

```bash
docker compose up --build
```

---

## 🧪 Como Rodar os Testes

### Rodar todos os testes uma vez

```bash
npm run test
```

### Cobertura dos testes

| Método | Cenários testados |
|---|---|
| `create()` | Criação com e sem descrição |
| `findAll()` | Paginação, filtro por status, lista vazia, cálculo de páginas |
| `findOne()` | Busca por ID existente e inexistente |
| `update()` | Atualização de status e título, ID inexistente |
| `remove()` | Remoção com sucesso, ID inexistente |

---

## 📡 Exemplos de Requisições

### Criar tarefa

```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Estudar NestJS",
    "description": "Revisar DTOs e Pipes",
    "status": "pending"
  }'
```

Resposta `201`:
```json
{
  "id": "uuid-1",
  "title": "Estudar NestJS",
  "description": "Revisar DTOs e Pipes",
  "status": "pending",
  "createdAt": "2026-03-09T00:00:00.000Z",
  "updatedAt": "2026-03-09T00:00:00.000Z"
}
```

### Listar todas as tarefas

```bash
curl http://localhost:3001/tasks
```

Resposta `200`:
```json
{
  "data": [...],
  "total": 25,
  "page": 1,
  "limit": 10,
  "totalPages": 3
}
```

### Listar com filtro por status

```bash
curl "http://localhost:3001/tasks?status=pending"
```

### Listar com paginação

```bash
curl "http://localhost:3001/tasks?page=2&limit=10"
```

### Buscar tarefa por ID

```bash
curl http://localhost:3001/tasks/<id>
```

Resposta `404` se não existir:
```json
{
  "statusCode": 404,
  "message": "Task <id> não encontrada"
}
```

### Atualizar tarefa

```bash
curl -X PUT http://localhost:3001/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'
```

### Deletar tarefa

```bash
curl -X DELETE http://localhost:3001/tasks/<id>
```

Resposta: `204 No Content`

---