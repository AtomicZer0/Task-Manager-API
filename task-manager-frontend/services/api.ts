import axios from "axios";

// Tipo: Define os possíveis estados de uma tarefa
// 'pending': Tarefa ainda não iniciada
// 'in_progress': Tarefa em andamento
// 'done': Tarefa finalizada/completada
export type TaskStatus = "pending" | "in_progress" | "done";

// Interface: Define a estrutura de uma tarefa completa retornada do backend
export interface Task {
  id: string; // Identificador único (UUID gerado pelo backend)
  title: string; // Título da tarefa (obrigatório)
  description?: string; // Descrição detalhada (opcional, pode ser undefined)
  status: TaskStatus; // Status atual da tarefa
  createdAt: string; // Data/hora de criação (ISO 8601)
  updatedAt: string; // Data/hora da última atualização (ISO 8601)
}

// Interface: DTO para criar uma nova tarefa
// Os dados enviados no corpo da requisição POST /tasks
export interface CreateTaskDto {
  title: string; // Título (obrigatório, validado no backend)
  description?: string; // Descrição (opcional)
  status: TaskStatus; // Status inicial (ex: 'pending')
}

// Interface: DTO para atualizar uma tarefa existente
// Todos os campos são opcionais (permite atualização parcial)
export interface UpdateTaskDto {
  title?: string; // Novo título (opcional, se não fornecido não muda)
  description?: string; // Nova descrição (opcional)
  status?: TaskStatus; // Novo status (opcional)
}

// Configuração do cliente Axios
// Define a URL base para todas as requisições (backend em http://localhost:3001)
// Todas as rotas serão relativas a este baseURL (ex: GET /tasks → http://localhost:3001/tasks)
const api = axios.create({
  baseURL: "http://localhost:3001",
});

// Objeto com todos os métodos para comunicação com a API de tarefas
export const taskService = {
  // GET /tasks
  // Busca todas as tarefas com suporte a filtro de status e paginação
  // Parâmetros opcionais: status (filtro), page (número da página), limit (items por página)
  // Retorna: Objeto com data (array de tarefas), total, page, totalPages
  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get<{ data: Task[]; total: number; page: number; totalPages: number }>(
      "/tasks",
      { params },
    ),

  // GET /tasks/:id
  // Busca uma tarefa específica pelo ID
  // Parâmetro: id (UUID da tarefa)
  // Retorna: Objeto Task com todos os dados
  getById: (id: string) => api.get<Task>(`/tasks/${id}`),

  // POST /tasks
  // Cria uma nova tarefa
  // Parâmetro: data (CreateTaskDto com title, description, status)
  // Retorna: Objeto Task criado com ID e timestamps gerados pelo backend
  create: (data: CreateTaskDto) => api.post<Task>("/tasks", data),

  // PUT /tasks/:id
  // Atualiza uma tarefa existente (suporta atualização parcial)
  // Parâmetros: id (UUID), data (UpdateTaskDto com campos a atualizar)
  // Retorna: Objeto Task atualizado
  update: (id: string, data: UpdateTaskDto) =>
    api.put<Task>(`/tasks/${id}`, data),

  // DELETE /tasks/:id
  // Deleta uma tarefa permanentemente
  // Parâmetro: id (UUID da tarefa)
  // Retorna: HTTP 204 No Content (sem corpo de resposta)
  delete: (id: string) => api.delete(`/tasks/${id}`),
};
