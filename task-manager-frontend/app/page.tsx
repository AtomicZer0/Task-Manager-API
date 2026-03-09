"use client";

import { useEffect, useState } from "react";
import { Task, TaskStatus, taskService } from "@/services/api";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";

// Type para o filtro: pode ser um status de tarefa ou string vazia (sem filtro)
type FilterType = TaskStatus | "";

// Array com opções de filtro para renderizar botões
// label: texto exibido no botão | value: valor do filtro (enviado para API)
const filterOptions: { label: string; value: FilterType }[] = [
  { label: "Todas", value: "" }, // Sem filtro - mostra todas as tarefas
  { label: "Pendentes", value: "pending" },
  { label: "Em Progresso", value: "in_progress" },
  { label: "Concluídas", value: "done" },
];

// Objeto que define a ordem de ordenação das tarefas
// Ordena por status: pending (0) → in_progress (1) → done (2)
const statusOrder: Record<TaskStatus, number> = {
  pending: 0,
  in_progress: 1,
  done: 2,
};

// Constante para quantidade de tarefas por página (paginação)
const LIMIT = 10;

// Componente principal (Home) - página raiz do aplicativo
// Gerencia estado de tarefas, filtros, paginação e operações CRUD
export default function Home() {
  // Estado: array de tarefas carregadas e exibidas na página
  const [tasks, setTasks] = useState<Task[]>([]);

  // Estado: tarefa sendo editada (null se nenhuma em edição)
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Estado: indicador de carregamento (true enquanto busca tarefas da API)
  const [loading, setLoading] = useState(true);

  // Estado: filtro atual de status ('' = sem filtro, 'pending'/'in_progress'/'done')
  const [filter, setFilter] = useState<FilterType>("");

  // Estado: número da página atual para paginação
  const [page, setPage] = useState(1);

  // Estado: total de páginas disponíveis
  const [totalPages, setTotalPages] = useState(1);

  // Estado: total de tarefas encontradas (com o filtro aplicado)
  const [total, setTotal] = useState(0);

  // Função para carregar tarefas do backend
  // Parâmetro: currentPage - número da página (padrão: página atual no estado)
  const loadTasks = async (currentPage = page) => {
    // Ativa indicador de carregamento
    setLoading(true);
    try {
      // Monta parâmetros da requisição
      const params = {
        ...(filter ? { status: filter } : {}), // Adiciona status apenas se filtro ativo
        page: currentPage,
        limit: LIMIT,
      };
      // Faz requisição GET para buscar tarefas do backend
      const response = await taskService.getAll(params);

      // Ordena tarefas por status (pending → in_progress → done)
      const sorted = [...response.data.data].sort(
        (a, b) => statusOrder[a.status] - statusOrder[b.status],
      );

      // Atualiza estado com tarefas ordenadas
      setTasks(sorted);
      // Atualiza metadados de paginação
      setTotalPages(response.data.totalPages);
      setTotal(response.data.total);
    } finally {
      // Desativa indicador de carregamento (mesmo em caso de erro)
      setLoading(false);
    }
  };

  // useEffect: Ao mudar de filtro, volta para página 1 e recarrega tarefas
  // Dependency: [filter] - executa quando filtro muda
  useEffect(() => {
    setPage(1);
    loadTasks(1);
  }, [filter]);

  // useEffect: Ao mudar de página, recarrega tarefas
  // Dependency: [page] - executa quando página muda
  useEffect(() => {
    loadTasks(page);
  }, [page]);

  // Handler: Gerencia exclusão de tarefa
  // Parâmetro: id - identificador único da tarefa a deletar
  const handleDelete = async (id: string) => {
    // Faz requisição DELETE para remover tarefa do backend
    await taskService.delete(id);

    // Filtra a tarefa deletada do array de estado
    const remaining = tasks.filter((t) => t.id !== id);
    // Decrementa total de tarefas
    setTotal((prev) => prev - 1);

    // Se a página ficou vazia e não é a primeira página, volta para página anterior
    if (remaining.length === 0 && page > 1) {
      // useEffect de [page] recarregará automaticamente ao mudar página
      setPage((p) => p - 1);
    } else {
      // Caso contrário, recarrega a página atual
      loadTasks(page);
    }
  };

  // Handler: Gerencia sucesso de criação/atualização de tarefa
  // Chamado após TaskForm enviar dados com sucesso para o backend
  const handleSuccess = () => {
    // Limpa tarefa em edição (fecha formulário de edição)
    setEditingTask(null);
    // Recarrega lista de tarefas para refletir as mudanças
    loadTasks(page);
  };

  // JSX: Renderização da interface do usuário
  return (
    // main: Container principal com altura mínima de tela inteira (min-h-screen)
    // bg-slate-100: Cor de fundo cinzento
    // p-4 sm:p-6: Padding responsivo (4 em mobile, 6 em desktop)
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      {/* div: Container centralizado com max-width 2xl e layout flexbox em coluna */}
      {/* gap-4 sm:gap-6: Espaçamento entre elementos (4 em mobile, 6 em desktop) */}
      <div className="max-w-2xl mx-auto flex flex-col gap-4 sm:gap-6">
        {/* Cabeçalho: Título da aplicação */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">
          📝 Task Manager
        </h1>

        {/* TaskForm: Componente renderável para criar/editar tarefas */}
        {/* Props:
            - onSuccess: Callback executado quando formulário é enviado com sucesso
            - editingTask: Tarefa em edição (null se criando nova tarefa)
            - onCancelEdit: Callback para cancelar edição
        */}
        <TaskForm
          onSuccess={handleSuccess}
          editingTask={editingTask}
          onCancelEdit={() => setEditingTask(null)}
        />

        {/* Seção de Filtros por Status */}
        {/* Renderiza botões para filtrar tarefas por status */}
        {/* Ao clicar em um botão, atualiza o estado 'filter' e dispara useEffect para recarregar tarefas */}
        <div className="flex flex-wrap gap-2 justify-center">
          {filterOptions.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              // className: Aplica estilos dinâmicos baseado se filtro está ativo
              // Filtro ativo: azul com texto branco | Inativo: branco com hover cinzento
              className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition ${
                filter === value
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-gray-600 shadow hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Seção: Lista de Tarefas com Estados Condicionais */}
        {/* loading: mostra spinner, vazio: mensagem de vazio, data: renderiza TaskCards */}
        {loading ? (
          // Estado 1: Carregando tarefas do backend
          <p className="text-center text-gray-400 text-sm">
            Carregando tarefas...
          </p>
        ) : tasks.length === 0 ? (
          // Estado 2: Nenhuma tarefa encontrada (lista vazia)
          <p className="text-center text-gray-400 text-sm mt-4">
            Nenhuma tarefa encontrada.
          </p>
        ) : (
          // Estado 3: Tarefas carregadas - renderiza cada uma com TaskCard
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

        {/* Seção: Paginação */}
        {/* Só mostra controles de paginação se houver mais de 1 página */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between gap-2 mt-2">
            {/* Botão: Volta para página anterior */}
            {/* Math.max(1, p - 1) impede ir para página 0 ou negativa */}
            {/* disabled={page === 1} desabilita o botão quando já está na primeira página */}
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white shadow text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ← Anterior
            </button>

            {/* Informações de Paginação: página atual, total de páginas e total de tarefas */}
            {/* Exemplo: "Página 2 de 5 (47 tarefas)" */}
            <span className="text-sm text-gray-500">
              Página <span className="font-semibold text-gray-700">{page}</span>{" "}
              de{" "}
              <span className="font-semibold text-gray-700">{totalPages}</span>
              <span className="text-gray-400"> ({total} tarefas)</span>
            </span>

            {/* Botão: Avança para próxima página */}
            {/* Math.min(totalPages, p + 1) impede ir além do total de páginas */}
            {/* disabled={page === totalPages} desabilita o botão quando já está na última página */}
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
