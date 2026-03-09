"use client";

import { useState, useEffect } from "react";
import { Task, TaskStatus, CreateTaskDto, taskService } from "@/services/api";

// Interface que define as props do componente TaskForm
interface Props {
  onSuccess: () => void; // Callback executado após sucesso na criação/edição
  editingTask?: Task | null; // Tarefa sendo editada (undefined ou null = criar nova)
  onCancelEdit: () => void; // Callback para cancelar edição
}

// Array com opções de status para o selector
// Inclui valor, rótulo e classes de cor Tailwind para cada status
const statusOptions: { value: TaskStatus; label: string; color: string }[] = [
  {
    value: "pending",
    label: "Pendente",
    color:
      "bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200",
  },
  {
    value: "in_progress",
    label: "Em Progresso",
    color: "bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200",
  },
  {
    value: "done",
    label: "Concluída",
    color: "bg-green-100 text-green-800 border-green-300 hover:bg-green-200",
  },
];

// Constante: Limite máximo de caracteres para o título
const MAX_TITLE = 100;
// Constante: Limite máximo de caracteres para a descrição
const MAX_DESC = 200;

// Componente TaskForm: Formulário para criar ou editar tarefas
// Propsistório: onSuccess (callback), editingTask (tarefa em edição), onCancelEdit (callback)
export function TaskForm({ onSuccess, editingTask, onCancelEdit }: Props) {
  // Estado: Título da tarefa
  const [title, setTitle] = useState("");

  // Estado: Descrição da tarefa
  const [description, setDescription] = useState("");

  // Estado: Status da tarefa (pending, in_progress, done)
  const [status, setStatus] = useState<TaskStatus>("pending");

  // Estado: Indicador de envio do formulário (true enquanto requisição da API)
  const [loading, setLoading] = useState(false);

  // Estado: Mensagem de erro (vazio se sem erro)
  const [error, setError] = useState("");

  // useEffect: Popula campos quando uma tarefa está sendo editada
  // Ou reseta campos quando criando nova tarefa
  // Dependency: [editingTask] - executa quando editingTask muda
  useEffect(() => {
    if (editingTask) {
      // Se editando: carrega dados da tarefa nos campos
      setTitle(editingTask.title);
      setDescription(editingTask.description || "");
      setStatus(editingTask.status);
    } else {
      // Se criando: reseta para valores vazios
      resetFields();
    }
  }, [editingTask]);

  // Função: Limpa todos os campos e mensagens de erro
  // Usada quando: formulário enviado com sucesso ou cancelado
  const resetFields = () => {
    setTitle("");
    setDescription("");
    setStatus("pending");
    setError("");
  };

  // Função: Gerencia envio do formulário
  // Validação, requisição para backend (criar ou editar), tratamento de erros
  const handleSubmit = async (e: React.FormEvent) => {
    // Previne comportamento padrão do formulário (recarregar página)
    e.preventDefault();

    // Ativa indicador de carregamento (desabilita botão enviar)
    setLoading(true);
    // Limpa mensagem de erro anterior
    setError("");

    try {
      // Prepara dados validated para enviar ao backend
      const data: CreateTaskDto = { title, description, status };

      // Verifica se está editando ou criando
      if (editingTask) {
        // Se editando: faz requisição PUT/PATCH com ID e dados
        await taskService.update(editingTask.id, data);
      } else {
        // Se criando: faz requisição POST com dados
        await taskService.create(data);
        // Após criar com sucesso: limpa campos do formulário
        resetFields();
      }

      // Após sucesso: executa callback para atualizar lista principal
      onSuccess();
    } catch {
      // Em caso de erro: mostra mensagem de erro ao usuário
      setError("Erro ao salvar a tarefa. Verifique se o backend está rodando.");
    } finally {
      // Desativa indicador de carregamento (em qualquer caso: sucesso ou erro)
      setLoading(false);
    }
  };

  // JSX: Renderização do formulário
  return (
    // form: Container do formulário com estilos de card (branco, sombra, arredondado)
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow p-4 sm:p-5 flex flex-col gap-3 w-full"
    >
      {/* Título dinâmico: "Editar Tarefa" ou "Nova Tarefa" */}
      <h2 className="font-semibold text-gray-700 text-base sm:text-lg">
        {editingTask ? "Editar Tarefa" : "Nova Tarefa"}
      </h2>

      {/* Mensagem de erro: Renderizada apenas se houver erro */}
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Seção: Campo de Título */}
      <div className="flex flex-col gap-1">
        {/* Input de título: campo obrigatório com limite de caracteres */}
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={MAX_TITLE}
          placeholder="Título *"
          className="border rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-gray-400 w-full"
        />
        {/* Contador de caracteres: muda cor para vermelho se no limite máximo */}
        <span
          className={`text-xs text-right ${title.length >= MAX_TITLE ? "text-red-500 font-medium" : "text-gray-400"}`}
        >
          {title.length}/{MAX_TITLE}
        </span>
      </div>

      {/* Seção: Campo de Descrição */}
      <div className="flex flex-col gap-1">
        {/* Textarea para descrição: campo opcional com limite de caracteres */}
        {/* rows={3}: altura do textarea em linhas de texto */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={MAX_DESC}
          placeholder="Descrição (opcional)"
          className="border rounded-lg px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-blue-400 resize-none placeholder:text-gray-400 placeholder:text-sm w-full"
          rows={3}
        />
        {/* Contador de caracteres: muda cor para vermelho se no limite máximo */}
        <span
          className={`text-xs text-right ${description.length >= MAX_DESC ? "text-red-500 font-medium" : "text-gray-400"}`}
        >
          {description.length}/{MAX_DESC}
        </span>
      </div>

      {/* Seção: Selector de Status (só mostra quando EDITANDO tarefa existente) */}
      {editingTask && (
        <div className="flex flex-col gap-1">
          {/* Label "Status" */}
          <span className="text-xs text-gray-500 font-medium">Status</span>

          {/* Botões toggle para selecionar status */}
          {/* Renderiza um botão para cada opção de status */}
          <div className="flex gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatus(option.value)}
                // className dinâmico: realça o status selecionado com ring (borda)
                className={`flex-1 text-xs font-medium px-2 sm:px-3 py-2 rounded-lg border transition ${option.color} ${
                  status === option.value
                    ? "ring-2 ring-offset-1 ring-gray-400 font-bold"
                    : "opacity-60"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Seção: Botões de Ação (Enviar e Cancelar) */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Botão Enviar: Criar nova tarefa ou Salvar alterações */}
        {/* disabled={loading}: desabilita durante envio para evitar múltiplos envios */}
        {/* Texto dinâmico: "Salvando..." durante requisição, "Salvar Alterações" em edição, "Criar Tarefa" ao criar */}
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg py-2 text-sm font-medium transition"
        >
          {loading
            ? "Salvando..."
            : editingTask
              ? "Salvar Alterações"
              : "Criar Tarefa"}
        </button>

        {/* Botão Cancelar: Só renderizado quando EDITANDO tarefa existente */}
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
