'use client';

import { useEffect, useState } from 'react';
import { Task, taskService } from '@/services/api';
import { TaskCard } from '@/components/TaskCard';
import { TaskForm } from '@/components/TaskForm';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {
      const response = await taskService.getAll();
      setTasks(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

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
        <h1 className="text-3xl font-bold text-gray-800 text-center">📝 Task Manager API</h1>

        <TaskForm
          onSuccess={handleSuccess}
          editingTask={editingTask}
          onCancelEdit={() => setEditingTask(null)}
        />

        {loading ? (
          <p className="text-center text-gray-400">Carregando tarefas...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-400 mt-4">Nenhuma tarefa criada ainda.</p>
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
