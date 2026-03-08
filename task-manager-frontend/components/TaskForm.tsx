'use client';

import { useState, useEffect } from 'react';
import { Task, TaskStatus, CreateTaskDto, taskService } from '@/services/api';

interface Props {
  onSuccess: () => void;
  editingTask?: Task | null;
  onCancelEdit: () => void;
}

export function TaskForm({ onSuccess, editingTask, onCancelEdit }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setStatus(editingTask.status);
    } else {
      setTitle('');
      setDescription('');
      setStatus('pending');
    }
  }, [editingTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data: CreateTaskDto = { title, description, status };
      if (editingTask) {
        await taskService.update(editingTask.id, data);
      } else {
        await taskService.create(data);
      }
      onSuccess();
    } catch {
      setError('Erro ao salvar a tarefa. Verifique o backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-5 flex flex-col gap-3">
      <h2 className="font-semibold text-black text-lg">
        {editingTask ? '✏️ Editar Tarefa' : '➕ Nova Tarefa'}
      </h2>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}

      <input
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título *"
        className="border rounded-lg px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-blue-400"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição (opcional)"
        className="border rounded-lg px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        rows={3}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as TaskStatus)}
        className="border rounded-lg px-3 py-2 text-sm text-black outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="pending">Pendente</option>
        <option value="in_progress">Em Progresso</option>
        <option value="done">Concluída</option>
      </select>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg py-2 text-sm font-medium transition"
        >
          {loading ? 'Salvando...' : editingTask ? 'Salvar Alterações' : 'Criar Tarefa'}
        </button>
        {editingTask && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium transition"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
