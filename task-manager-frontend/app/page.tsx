'use client';

import { useEffect, useState } from 'react';
import { Task, TaskStatus, taskService } from '@/services/api';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';

type FilterType = TaskStatus | '';

const filterOptions: { label: string; value: FilterType }[] = [
  { label: 'Todas', value: '' },
  { label: 'Pendentes', value: 'pending' },
  { label: 'Em Progresso', value: 'in_progress' },
  { label: 'Concluídas', value: 'done' },
];

const statusOrder: Record<TaskStatus, number> = {
  pending: 0,
  in_progress: 1,
  done: 2,
};

const LIMIT = 10;

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadTasks = async (currentPage = page) => {
    setLoading(true);
    try {
      const params = {
        ...(filter ? { status: filter } : {}),
        page: currentPage,
        limit: LIMIT,
      };
      const response = await taskService.getAll(params);
      const sorted = [...response.data.data].sort(
        (a, b) => statusOrder[a.status] - statusOrder[b.status],
      );
      setTasks(sorted);
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } finally {
      setLoading(false);
    }
  };

  // Ao trocar filtro, volta para página 1
  useEffect(() => {
    setPage(1);
    loadTasks(1);
  }, [filter]);

  // Ao trocar página, recarrega
  useEffect(() => {
    loadTasks(page);
  }, [page]);

const handleDelete = async (id: string) => {
  await taskService.delete(id);

  const remaining = tasks.filter((t) => t.id !== id);
  setTotal((prev) => prev - 1);

  if (remaining.length === 0 && page > 1) {
    setPage((p) => p - 1); // ← o useEffect de [page] recarrega automaticamente
  } else {
    loadTasks(page);
  }
};



const handleSuccess = () => {
  setEditingTask(null);
  loadTasks(page);
};


  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-4 sm:gap-6">

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
          📝 Task Manager
        </h1>

        <TaskForm
          onSuccess={handleSuccess}
          editingTask={editingTask}
          onCancelEdit={() => setEditingTask(null)}
        />

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 justify-center">
          {filterOptions.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
                filter === value
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-gray-600 shadow hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Lista de tarefas */}
        {loading ? (
          <p className="text-center text-gray-400 text-sm">Carregando tarefas...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-4">Nenhuma tarefa encontrada.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDelete}
                onUpdate={setEditingTask}
              />
            ))}
          </div>
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-2 mt-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white shadow text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ← Anterior
            </button>

            <span className="text-sm text-gray-500">
              Página <span className="font-semibold text-gray-700">{page}</span> de{' '}
              <span className="font-semibold text-gray-700">{totalPages}</span>
              <span className="text-gray-400"> ({total} tarefas)</span>
            </span>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white shadow text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Próxima →
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
