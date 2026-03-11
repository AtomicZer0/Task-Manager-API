# 🖥️ Task Manager — Frontend

Interface web desenvolvida com Next.js para gerenciamento de tarefas com autenticação de usuários.

## 🛠️ Tecnologias

- [Next.js 15](https://nextjs.org/) — framework React com App Router
- [TypeScript](https://www.typescriptlang.org/) — tipagem estática
- [Tailwind CSS](https://tailwindcss.com/) — estilização utilitária
- [Axios](https://axios-http.com/) — requisições HTTP com interceptors JWT

## 📁 Estrutura

| Arquivo | Responsabilidade |
|---|---|
| `page.tsx` | Página principal — lista tarefas, filtros e paginação |
| `login/page.tsx` | Página de login |
| `register/page.tsx` | Página de criação de conta |
| `TaskCard.tsx` | Exibe uma tarefa com botões de editar e excluir |
| `TaskForm.tsx` | Formulário de criação e edição de tarefas |
| `api.ts` | Centraliza chamadas HTTP, interceptors JWT e serviços de auth |

---

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

### Com Docker

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

## 🔐 Fluxo de Autenticação

1. Usuário acessa qualquer página → redirecionado para `/login` se não autenticado
2. Após login bem-sucedido, o token JWT é salvo no `localStorage`
3. O interceptor do Axios injeta o token automaticamente em toda requisição
4. Se o token expirar ou for inválido, o interceptor redireciona para `/login`
5. O botão **Sair** remove o token do `localStorage` e redireciona para `/login`

---

## 📡 Exemplos de Requisições

O frontend consome a API via `src/services/api.ts`. Abaixo estão os exemplos equivalentes em `curl`:

### Registrar conta

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"123456"}'
```

### Fazer login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"123456"}'
```

### Listar tarefas do usuário autenticado

```bash
curl "http://localhost:3001/tasks?page=1&limit=10" \
  -H "Authorization: Bearer <access_token>"
```

### Filtrar por status

```bash
curl "http://localhost:3001/tasks?status=in_progress" \
  -H "Authorization: Bearer <access_token>"
```

### Criar tarefa

```bash
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"title":"Nova tarefa","status":"pending"}'
```

### Atualizar status

```bash
curl -X PUT http://localhost:3001/tasks/<id> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{"status":"done"}'
```

### Deletar tarefa

```bash
curl -X DELETE http://localhost:3001/tasks/<id> \
  -H "Authorization: Bearer <access_token>"
```

---

## ⚙️ Configuração da API

A URL base do backend está em `src/services/api.ts`:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:3001',
});
```
