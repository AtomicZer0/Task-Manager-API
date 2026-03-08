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

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('');

  const loadTasks = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const response = await taskService.getAll(params);
      setTasks(response.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filter]); // re-busca automaticamente ao trocar o filtro

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSuccess = () => {
    setEditingTask(null);
    loadTasks();
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center">📝 Task Manager</h1>

        <TaskForm
          onSuccess={handleSuccess}
          editingTask={editingTask}
          onCancelEdit={() => setEditingTask(null)}
        />

        {/* Botões de filtro — sem alterar a URL */}
        <div className="flex gap-2 justify-center flex-wrap">
          {filterOptions.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                filter === value
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white text-gray-600 shadow hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Carregando tarefas...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-400 mt-4">Nenhuma tarefa encontrada.</p>
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
      </div>
    </main>
  );
}
