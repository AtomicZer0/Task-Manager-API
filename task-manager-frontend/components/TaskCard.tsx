'use client';

import { Task, TaskStatus, taskService } from '@/services/api';

const statusLabel: Record<TaskStatus, string> = {
  pending: 'Pendente',
  in_progress: 'Em Progresso',
  done: 'Concluída',
};

const statusColor: Record<TaskStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800',
};

interface Props {
  task: Task;
  onDelete: (id: string) => void;
  onUpdate: (task: Task) => void;
}

export function TaskCard({ task, onDelete, onUpdate }: Props) {
  const handleDelete = async () => {
    await taskService.delete(task.id);
    onDelete(task.id);
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-2">
      <div className="flex justify-between items-start gap-2">
        <h2 className="font-semibold text-gray-800">{task.title}</h2>
        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${statusColor[task.status]}`}>
          {statusLabel[task.status]}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500">{task.description}</p>
      )}

      <div className="flex gap-2 mt-1">
        <button
          onClick={() => onUpdate(task)}
          className="flex-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-1.5 transition"
        >
          Editar
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg py-1.5 transition"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}
