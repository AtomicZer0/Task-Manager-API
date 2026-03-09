# ⚙️ Task Manager — Backend

API REST desenvolvida com NestJS e PostgreSQL para gerenciamento de tarefas.

## 🛠️ Tecnologias

- [NestJS](https://nestjs.com/) — framework Node.js progressivo
- [TypeORM](https://typeorm.io/) — ORM para PostgreSQL
- [PostgreSQL](https://www.postgresql.org/) — banco de dados relacional
- [class-validator](https://github.com/typestack/class-validator) — validação de dados
- [Jest](https://jestjs.io/) — testes unitários


## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js 20+
- PostgreSQL rodando localmente

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Crie o arquivo `.env` na raiz da pasta:

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

### 4. Rodar em modo desenvolvimento

```bash
npm run start:dev
```

A API estará disponível em [**http://localhost:3001**](http://localhost:3001)

---

## 🧪 Testes

```bash
# Rodar todos os testes
npm run test

# Modo watch (re-roda ao salvar)
npm run test:watch

# Relatório de cobertura
npm run test:cov
```

### Cobertura de testes

Os testes cobrem os seguintes cenários:

| Método | Cenários testados |
|---|---|
| `create()` | Criação com e sem descrição |
| `findAll()` | Paginação, filtro por status, lista vazia, cálculo de páginas |
| `findOne()` | Busca por ID existente e inexistente |
| `update()` | Atualização de status e título, ID inexistente |
| `remove()` | Remoção com sucesso, ID inexistente |

---