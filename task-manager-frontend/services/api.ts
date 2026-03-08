import axios from 'axios';

export type TaskStatus = 'pending' | 'in_progress' | 'done';

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
  baseURL: 'http://localhost:3001',
});

export const taskService = {
  getAll: (params?: { status?: string; page?: number; limit?: number }) =>
  api.get<{ data: Task[]; total: number; page: number; totalPages: number }>('/tasks', { params }),

  getById: (id: string) => api.get<Task>(`/tasks/${id}`),
  create: (data: CreateTaskDto) => api.post<Task>('/tasks', data),
  update: (id: string, data: UpdateTaskDto) => api.put<Task>(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};
