# ⚙️ Task Manager — Backend

API REST desenvolvida com NestJS e PostgreSQL para gerenciamento de tarefas com autenticação JWT.

## 🛠️ Tecnologias

- [NestJS](https://nestjs.com/) — framework Node.js progressivo
- [TypeORM](https://typeorm.io/) — ORM para PostgreSQL
- [PostgreSQL](https://www.postgresql.org/) — banco de dados relacional
- [JWT](https://jwt.io/) — autenticação stateless via tokens
- [Bcrypt](https://www.npmjs.com/package/bcrypt) — hash seguro de senhas
- [class-validator](https://github.com/typestack/class-validator) — validação de dados
- [Jest](https://jestjs.io/) — testes unitários


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
JWT_SECRET=seu_segredo_super_secreto_aqui
JWT_EXPIRES_IN=7d
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

A API estará disponível em [**http://localhost:3001**](http://localhost:3001)

### Com Docker

Na raiz do monorepo:

```bash
docker compose up --build
```

---

## 🧪 Como Rodar os Testes

### Rodar todos os testes

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

Base URL: `http://localhost:3001`

### Registrar usuário

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"123456"}'
```

Resposta `201`:
```json
{
  "message": "Usuário criado com sucesso"
}
```

### Fazer login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"123456"}'
```

Resposta `200`:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

### Criar tarefa

```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
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
  "userId": "uuid-do-usuario",
  "createdAt": "2026-03-11T00:00:00.000Z",
  "updatedAt": "2026-03-11T00:00:00.000Z"
}
```

### Listar tarefas

```bash
curl http://localhost:3001/tasks \
  -H "Authorization: Bearer <access_token>"
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
curl "http://localhost:3001/tasks?status=pending" \
  -H "Authorization: Bearer <access_token>"
```

### Listar com paginação

```bash
curl "http://localhost:3001/tasks?page=2&limit=10" \
  -H "Authorization: Bearer <access_token>"
```

### Buscar tarefa por ID

```bash
curl http://localhost:3001/tasks/<id> \
  -H "Authorization: Bearer <access_token>"
```

Resposta `404` se não existir ou não pertencer ao usuário:
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
  -H "Authorization: Bearer <access_token>" \
  -d '{"status": "done"}'
```

### Deletar tarefa

```bash
curl -X DELETE http://localhost:3001/tasks/<id> \
  -H "Authorization: Bearer <access_token>"
```

Resposta: `204 No Content`


## 🔐 Autenticação

Todas as rotas de `/tasks` exigem o header:

```
Authorization: Bearer <access_token>
```

Sem o token ou com token inválido/expirado, a API retorna `401 Unauthorized`.
