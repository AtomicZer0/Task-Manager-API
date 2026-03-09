# 🖥️ Task Manager — Frontend

Interface web desenvolvida com Next.js 15 para gerenciamento de tarefas.

## 📦 Como Instalar

### Pré-requisitos

- Node.js 20+
- Backend rodando em `http://localhost:3001`

### Instalar dependências

```bash
npm install
```

---

## 🚀 Como Rodar

### Modo desenvolvimento

```bash
npm run dev
```

### Modo produção

```bash
npm run build
npm run start
```

A aplicação estará disponível em [**http://localhost:3000**](http://localhost:3000)

### Rodar com Docker

Na raiz do monorepo:

```bash
docker compose up --build
```

---

## 🧪 Como Rodar os Testes

Os testes do projeto estão no backend. Para rodá-los:

```bash
cd ../task-manager-backend
npm run test
```

---

## 📡 Exemplos de Requisições

O frontend consome a API via `src/services/api.ts`. Abaixo estão os exemplos equivalentes em `curl`:

### Listar tarefas (página 1)

```bash
curl "http://localhost:3001/tasks?page=1&limit=10"
```

### Filtrar por status

```bash
curl "http://localhost:3001/tasks?status=in_progress"
```

### Criar tarefa

```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Nova tarefa","status":"pending"}'
```

### Atualizar status de uma tarefa

```bash
curl -X PUT http://localhost:3001/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'
```

### Deletar tarefa

```bash
curl -X DELETE http://localhost:3001/tasks/<id>
```

---

## ⚙️ Configuração da API

A URL base do backend está em `src/services/api.ts`:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:3001',
});
```

Se o backend estiver em outra URL, altere o `baseURL`.
