# 🖥️ Task Manager — Frontend

Interface web desenvolvida com Next.js 15 para gerenciamento de tarefas, consumindo a API REST do backend.

## 🛠️ Tecnologias

- [Next.js 15](https://nextjs.org/) — framework React com App Router
- [TypeScript](https://www.typescriptlang.org/) — tipagem estática
- [Tailwind CSS](https://tailwindcss.com/) — estilização utilitária
- [Axios](https://axios-http.com/) — requisições HTTP

## 📁 Estrutura

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── TaskCard.tsx
│   └── TaskForm.tsx
└── services/
    └── api.ts
```

### Responsabilidade de cada arquivo

| Arquivo | Responsabilidade |
|---|---|
| `page.tsx` | Página principal — lista tarefas e gerencia estado |
| `TaskCard.tsx` | Exibe uma tarefa com botões de editar e excluir |
| `TaskForm.tsx` | Formulário de criação e edição de tarefas |
| `api.ts` | Centraliza todas as chamadas HTTP ao backend |

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js 20+
- Backend rodando em `http://localhost:3001`

### 1. Instalar dependências

```bash
npm install
```

### 2. Rodar em modo desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em [**http://localhost:3000**](http://localhost:3000)

---

## ⚙️ Configuração da API

A URL base do backend está definida em `src/services/api.ts`:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:3001',
});
```

Se o backend estiver em outra URL, altere o `baseURL`.

---

## 🔧 Funcionalidades

- ✅ Criar tarefas com título, descrição e status
- ✅ Listar todas as tarefas
- ✅ Filtrar tarefas por status (Pendente, Em Progresso, Concluída)
- ✅ Editar tarefas existentes
- ✅ Excluir tarefas
- ✅ Feedback de loading e erros nas requisições

---

## 🐳 Rodar com Docker

Na raiz do monorepo:

```bash
docker compose up --build
```

A aplicação estará disponível em [**http://localhost:3000**](http://localhost:3000)
