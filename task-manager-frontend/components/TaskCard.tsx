"use client";

import { Task, TaskStatus } from "@/services/api";

// Objeto que mapeia cada status para seu rótulo em português
// Key: Status da tarefa (pending, in_progress, done)
// Value: Texto a exibir para o usuário
const statusLabel: Record<TaskStatus, string> = {
  pending: "Pendente", // Tarefa ainda não iniciada
  in_progress: "Em Progresso", // Tarefa em andamento
  done: "Concluída", // Tarefa finalizada
};

// Objeto que mapeia cada status para suas cores (classes Tailwind CSS)
// Usa cores para diferenciar visualmente o status da tarefa
const statusColor: Record<TaskStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800", // Amarelo para pendente
  in_progress: "bg-blue-100 text-blue-800", // Azul para em progresso
  done: "bg-green-100 text-green-800", // Verde para concluída
};

// Interface que define as props do componente TaskCard
interface Props {
  task: Task; // Dados da tarefa a renderizar
  onDelete: (id: string) => void; // Callback para deletar tarefa (recebe ID)
  onUpdate: (task: Task) => void; // Callback para editar tarefa (recebe tarefa inteira)
}

// Componente TaskCard: Renderiza um card representando uma tarefa
// Exibe: título, descrição, status e botões de ação (editar/excluir)
// Props: task (dados), onDelete e onUpdate (callbacks de ação)
export function TaskCard({ task, onDelete, onUpdate }: Props) {
  return (
    // Container principal: card com fundo claro, bordas arredondadas e sombra
    <div className="bg-slate-50 rounded-xl shadow p-4 flex flex-col gap-2 w-full overflow-hidden">
      {/* Cabeçalho do card: Título e Status */}
      {/* flex-col em mobile, flex-row em desktop para layout responsivo */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
        {/* Título da tarefa */}
        {/* break-all: quebra palavras longas sem hífens para caber no card */}
        {/* flex-1: ocupa espaço disponível, empurrando o status para a direita */}
        <h2 className="font-semibold text-gray-800 text-sm sm:text-base break-all flex-1">
          {task.title}
        </h2>
        {/* Badge de Status */}
        {/* className dinâmico: usa statusColor para cores baseadas no status da tarefa */}
        {/* whitespace-nowrap: evita quebra de linha do rótulo de status */}
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap self-start ${statusColor[task.status]}`}
        >
          {statusLabel[task.status]}
        </span>
      </div>

      {/* Descrição da tarefa (renderizada apenas se houver conteúdo) */}
      {/* && condicional: mostra descrição se task.description não for vazio */}
      {task.description && (
        <p className="text-sm text-gray-500 break-all">{task.description}</p>
      )}

      {/* Rodapé do card: Botões de ações (Editar e Excluir) */}
      {/* flex-1: cada botão ocupa espaço igual no container */}
      <div className="flex flex-col sm:flex-row gap-2 mt-1">
        {/* Botão Editar */}
        {/* onClick: ao clicar, chama onUpdate passando a tarefa completa */}
        {/* Cores: azul com hover mais escuro */}
        <button
          onClick={() => onUpdate(task)}
          className="flex-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-1.5 transition"
        >
          Editar
        </button>

        {/* Botão Excluir */}
        {/* onClick: ao clicar, chama onDelete passando apenas o ID da tarefa */}
        {/* Cores: vermelho com hover mais escuro */}
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
