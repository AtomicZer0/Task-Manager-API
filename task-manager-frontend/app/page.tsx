"use client";

import { useEffect, useState } from "react";
import { Task, TaskStatus, taskService } from "@/services/api";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";

import { useRouter } from "next/navigation";
import { authService } from "@/services/api";

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
  const router = useRouter();

  // Verifica autenticação ao carregar a página
  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login");
    }
  }, []);

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
    <main className="min-h-screen bg-slate-100 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-4 sm:gap-6">
        {/* Cabeçalho com botão de logout */}
        <div className="flex justify-between items-center bg-white rounded-xl shadow px-5 py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            📝 Task Manager
          </h1>
          <button
            onClick={authService.logout}
            className="flex items-center gap-2 text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 border border-red-200 px-4 py-2 rounded-lg transition"
          >
            <span>Sair</span>
            <span>→</span>
          </button>
        </div>

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
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white text-gray-600 shadow hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Lista de tarefas */}
        {loading ? (
          <p className="text-center text-gray-400 text-sm">
            Carregando tarefas...
          </p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-4">
            Nenhuma tarefa encontrada.
          </p>
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
              Página <span className="font-semibold text-gray-700">{page}</span>{" "}
              de{" "}
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
