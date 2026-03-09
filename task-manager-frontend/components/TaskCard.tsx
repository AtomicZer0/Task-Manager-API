'use client';

import { Task, TaskStatus } from '@/services/api';

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
  return (
    <div className="bg-slate-50 rounded-xl shadow p-4 flex flex-col gap-2 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        <h2 className="font-semibold text-gray-800 text-sm sm:text-base break-all flex-1">
          {task.title}
        </h2>
        <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap self-start ${statusColor[task.status]}`}>
          {statusLabel[task.status]}
        </span>
      </div>

      {task.description && (
        <p className="text-sm text-gray-500 break-all">{task.description}</p>
      )}

      <div className="flex flex-col sm:flex-row gap-2 mt-1">
        <button
          onClick={() => onUpdate(task)}
          className="flex-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-1.5 transition"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="flex-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg py-1.5 transition"
        >
          Excluir
        </button>
      </div>
    </div>
  );
}
