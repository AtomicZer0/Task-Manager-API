# 📝 Task Manager

Aplicação fullstack de gerenciamento de tarefas com criação, listagem, filtragem, paginação, atualização e exclusão.

## 📦 Como Instalar

### Pré-requisitos

- [Docker](https://www.docker.com/) instalado e rodando
- [Git](https://git-scm.com/)

### 1. Clonar o repositório

```bash
git clone https://github.com/AtomicZer0/Task-Manager-API.git
cd task-manager
```

### 2. Subir os containers

```bash
docker compose build
```

---

### Acessar a aplicação

| Serviço | URL |
|---|---|
| Frontend | http://localhost:3000 |

### Parar os serviços

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

---

## 📡 Exemplos de Requisições

### Criar tarefa

```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Estudar NestJS","description":"Revisar DTOs","status":"pending"}'
```

### Listar todas as tarefas

```bash
curl http://localhost:3001/tasks
```

### Listar com filtro e paginação

```bash
curl "http://localhost:3001/tasks?status=pending&page=1&limit=10"
```

### Buscar tarefa por ID

```bash
curl http://localhost:3001/tasks/<id>
```

### Atualizar tarefa

```bash
curl -X PUT http://localhost:3001/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'
```

### Deletar tarefa

```bash
curl -X DELETE http://localhost:3001/tasks/<id>
```
