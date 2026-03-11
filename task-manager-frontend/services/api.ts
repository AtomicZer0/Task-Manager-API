import axios from "axios";

export type TaskStatus = "pending" | "in_progress" | "done";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status: TaskStatus;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

const api = axios.create({
  baseURL: "http://localhost:3001",
});

/**
 * Interceptor de requisição — executado antes de TODA chamada à API.
 * Lê o token salvo no localStorage e injeta no header Authorization.
 * Isso evita ter que passar o token manualmente em cada chamada.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Interceptor de resposta — executado após TODA resposta da API.
 * Se receber 401 (não autorizado), limpa o token salvo e
 * redireciona para a página de login.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const taskService = {
  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get<{ data: Task[]; total: number; page: number; totalPages: number }>(
      "/tasks",
      { params },
    ),
  getById: (id: string) => api.get<Task>(`/tasks/${id}`),
  create: (data: CreateTaskDto) => api.post<Task>("/tasks", data),
  update: (id: string, data: UpdateTaskDto) =>
    api.put<Task>(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

export const authService = {
  /** Envia email e senha, recebe e salva o token no localStorage */
  login: async (email: string, password: string) => {
    const response = await api.post<{ access_token: string }>("/auth/login", {
      email,
      password,
    });
    localStorage.setItem("access_token", response.data.access_token);
    return response.data;
  },

  /** Cria uma nova conta */
  register: (email: string, password: string) =>
    api.post("/auth/register", { email, password }),

  /** Remove o token e redireciona para login */
  logout: () => {
    localStorage.removeItem("access_token");
    window.location.href = "/login";
  },

  /** Verifica se há token salvo */
  isAuthenticated: () => !!localStorage.getItem("access_token"),
};
