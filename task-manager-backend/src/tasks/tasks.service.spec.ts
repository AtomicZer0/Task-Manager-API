import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, TaskStatus } from './task.entity';
import { NotFoundException } from '@nestjs/common';

// Mock do repositório TypeORM — simula o banco de dados sem precisar dele
// Cada método é um jest.fn() que pode ser configurado e monitorado nos testes
// Simula métodos do repositório: create, save, findAndCount, findOneBy, remove
const mockRepository = {
  create: jest.fn(), // Mock para criar nova instância de Task
  save: jest.fn(), // Mock para salvar tarefa no banco
  findAndCount: jest.fn(), // Mock para buscar tarefas com paginação
  findOneBy: jest.fn(), // Mock para buscar uma tarefa por ID
  remove: jest.fn(), // Mock para deletar uma tarefa
};

// describe: Agrupa todos os testes do TasksService
describe('TasksService', () => {
  // Variável para armazenar a instância do serviço durante os testes
  let service: TasksService;

  // beforeEach: Hook que executa antes de cada teste
  // Configura o módulo de teste com o serviço e o repositório mockado
  beforeEach(async () => {
    // Cria um módulo de teste
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        // Registra o serviço a ser testado
        TasksService,
        {
          // Injeta o mock no lugar do repositório real
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    // Obtém a instância do serviço do módulo de teste
    service = module.get<TasksService>(TasksService);

    // Limpa o histórico de chamadas entre cada teste para evitar dados conflitantes
    jest.clearAllMocks();
  });

  // ========================================================================================
  // TESTES DO MÉTODO CREATE
  // ========================================================================================
  describe('create()', () => {
    // Teste: verifica se uma tarefa completa é criada corretamente
    it('deve criar e retornar uma nova tarefa', async () => {
      // Arrange: Prepara os dados do DTO com todos os campos
      const dto = {
        title: 'Estudar NestJS',
        description: 'Revisar DTOs e Pipes',
        status: TaskStatus.PENDING,
      };
      // Prepara a tarefa que será retornada com ID gerado
      const taskCriada = { id: 'uuid-1', ...dto };

      // Act: Configura os mocks para retornar a tarefa
      mockRepository.create.mockReturnValue(taskCriada);
      mockRepository.save.mockResolvedValue(taskCriada);

      // Executa o método do serviço
      const resultado = await service.create(dto);

      // Assert: Valida os resultados
      // Verifica que o create foi chamado com o DTO correto
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      // Verifica que o save foi chamado com a tarefa criada
      expect(mockRepository.save).toHaveBeenCalledWith(taskCriada);
      // Verifica que o resultado é a tarefa esperada
      expect(resultado).toEqual(taskCriada);
    });

    // Teste: verifica se uma tarefa sem descrição (campo opcional) é criada
    it('deve criar uma tarefa sem descrição (campo opcional)', async () => {
      // Arrange: Cria DTO sem descrição
      const dto = { title: 'Tarefa simples', status: TaskStatus.PENDING };
      // Cria tarefa sem descrição
      const taskCriada = { id: 'uuid-2', ...dto };

      // Act: Configura os mocks
      mockRepository.create.mockReturnValue(taskCriada);
      mockRepository.save.mockResolvedValue(taskCriada);

      // Executa o método
      const resultado = await service.create(dto);

      // Assert: Valida que o título está correto e descrição é undefined
      expect(resultado.title).toBe('Tarefa simples');
      expect(resultado.description).toBeUndefined();
    });
  });

  // ========================================================================================
  // TESTES DO MÉTODO FIND ALL
  // ========================================================================================
  describe('findAll()', () => {
    // Teste: verifica se todas as tarefas são retornadas com paginação
    it('deve retornar todas as tarefas paginadas', async () => {
      // Arrange: Prepara lista de 2 tarefas
      const tasks = [
        { id: 'uuid-1', title: 'Tarefa 1', status: TaskStatus.PENDING },
        { id: 'uuid-2', title: 'Tarefa 2', status: TaskStatus.DONE },
      ];
      // Act: Configura mock para retornar as tarefas
      mockRepository.findAndCount.mockResolvedValue([tasks, 2]);

      // Executa o método
      const resultado = await service.findAll();

      // Assert: Valida os resultados da paginação
      expect(resultado.data).toHaveLength(2);
      expect(resultado.total).toBe(2);
      expect(resultado.page).toBe(1); // Página padrão
      expect(resultado.totalPages).toBe(1); // 2 itens em 1 página
    });

    // Teste: verifica se lista vazia é retornada quando não há tarefas
    it('deve retornar lista vazia quando não há tarefas', async () => {
      // Act: Configura mock para retornar lista vazia
      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      // Executa o método
      const resultado = await service.findAll();

      // Assert: Valida que a lista está vazia
      expect(resultado.data).toHaveLength(0);
      expect(resultado.total).toBe(0);
      expect(resultado.totalPages).toBe(0);
    });

    // Teste: verifica se o filtro por status funciona
    it('deve filtrar tarefas pelo status "pending"', async () => {
      // Arrange: Prepara lista com apenas tarefas pending
      const tasks = [
        { id: 'uuid-1', title: 'Tarefa 1', status: TaskStatus.PENDING },
      ];
      // Act: Configura mock
      mockRepository.findAndCount.mockResolvedValue([tasks, 1]);

      // Executa o método com filtro de status
      const resultado = await service.findAll(TaskStatus.PENDING);

      // Assert: Valida que o filtro foi aplicado
      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: TaskStatus.PENDING },
        }),
      );
      // Verifica que apenas tarefas com status PENDING foram retornadas
      expect(resultado.data[0].status).toBe(TaskStatus.PENDING);
    });

    // Teste: verifica cálculo correto de página total
    it('deve calcular corretamente o total de páginas', async () => {
      // Arrange: Prepara array com 5 tarefas mas total = 23
      const tasks = Array(5).fill({
        id: 'uuid-1',
        title: 'Tarefa',
        status: TaskStatus.PENDING,
      });
      // Act: Configura mock com 23 tarefas no total
      mockRepository.findAndCount.mockResolvedValue([tasks, 23]);

      // 23 tarefas com limit=10 → devem ser 3 páginas
      // Executa o método
      const resultado = await service.findAll(undefined, 1, 10);

      // Assert: Valida que o total de páginas foi calculado corretamente
      // Math.ceil(23 / 10) = 3 páginas
      expect(resultado.totalPages).toBe(3);
    });

    // Teste: verifica se a paginação funciona na página 2
    it('deve aplicar paginação corretamente na página 2', async () => {
      // Act: Configura mock
      mockRepository.findAndCount.mockResolvedValue([[], 20]);

      // Executa o método na página 2
      await service.findAll(undefined, 2, 10);

      // Assert: Valida que os parâmetros de skip e take estão corretos
      // skip = (2-1) * 10 = 10 (pula 10 registros para pegar página 2)
      // take = 10 (retorna 10 registros)
      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10, // Pula 10 registros da página anterior
          take: 10, // Retorna 10 registros
        }),
      );
    });
  });

  // ========================================================================================
  // TESTES DO MÉTODO FIND ONE
  // ========================================================================================
  describe('findOne()', () => {
    // Teste: verifica se uma tarefa é retornada pelo ID
    it('deve retornar uma tarefa pelo ID', async () => {
      // Arrange: Prepara a tarefa
      const task = {
        id: 'uuid-1',
        title: 'Tarefa 1',
        status: TaskStatus.PENDING,
      };
      // Act: Configura mock para retornar a tarefa
      mockRepository.findOneBy.mockResolvedValue(task);

      // Executa o método passando um ID
      const resultado = await service.findOne('uuid-1');

      // Assert: Valida os resultados
      // Verifica que findOneBy foi chamado com o ID correto
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id: 'uuid-1' });
      // Verifica que a tarefa retornada é a esperada
      expect(resultado).toEqual(task);
    });

    // Teste: verifica se NotFoundException é lançada quando ID não existe
    it('deve lançar NotFoundException quando o ID não existir', async () => {
      // Act: Configura mock para retornar null (tarefa não encontrada)
      mockRepository.findOneBy.mockResolvedValue(null);

      // Assert: Valida que a exceção é lançada
      await expect(service.findOne('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });

    // Teste: verifica se a mensagem de erro está correta
    it('deve incluir a mensagem de erro correta no NotFoundException', async () => {
      // Act: Configura mock para retornar null
      mockRepository.findOneBy.mockResolvedValue(null);

      // Assert: Valida que a mensagem de erro contém o ID
      await expect(service.findOne('id-inexistente')).rejects.toThrow(
        'id-inexistente',
      );
    });
  });

  // ========================================================================================
  // TESTES DO MÉTODO UPDATE
  // ========================================================================================
  describe('update()', () => {
    // Teste: verifica se o status é atualizado corretamente
    it('deve atualizar o status da tarefa', async () => {
      // Arrange: Prepara a tarefa inicial e a tarefa atualizada
      const task = {
        id: 'uuid-1',
        title: 'Tarefa 1',
        status: TaskStatus.PENDING,
      };
      // Tarefa após atualização
      const taskAtualizada = { ...task, status: TaskStatus.DONE };

      // Act: Configura mocks
      mockRepository.findOneBy.mockResolvedValue(task);
      mockRepository.save.mockResolvedValue(taskAtualizada);

      // Executa o método
      const resultado = await service.update('uuid-1', {
        status: TaskStatus.DONE,
      });

      // Assert: Valida que o status foi atualizado
      expect(resultado.status).toBe(TaskStatus.DONE);
      // Verifica que save foi chamado
      expect(mockRepository.save).toHaveBeenCalled();
    });

    // Teste: verifica se o título é atualizado corretamente
    it('deve atualizar o título da tarefa', async () => {
      // Arrange: Prepara tarefa com título antigo
      const task = {
        id: 'uuid-1',
        title: 'Título antigo',
        status: TaskStatus.PENDING,
      };
      // Tarefa com título atualizado
      const taskAtualizada = { ...task, title: 'Título novo' };

      // Act: Configura mocks
      mockRepository.findOneBy.mockResolvedValue(task);
      mockRepository.save.mockResolvedValue(taskAtualizada);

      // Executa o método
      const resultado = await service.update('uuid-1', {
        title: 'Título novo',
      });

      // Assert: Valida que o título foi atualizado
      expect(resultado.title).toBe('Título novo');
    });

    // Teste: verifica se NotFoundException é lançada ao atualizar ID inexistente
    it('deve lançar NotFoundException ao atualizar ID inexistente', async () => {
      // Act: Configura mock para retornar null
      mockRepository.findOneBy.mockResolvedValue(null);

      // Assert: Valida que a exceção é lançada
      await expect(
        service.update('id-inexistente', { status: TaskStatus.DONE }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ========================================================================================
  // TESTES DO MÉTODO REMOVE
  // ========================================================================================
  describe('remove()', () => {
    // Teste: verifica se uma tarefa é removida com sucesso
    it('deve remover a tarefa com sucesso', async () => {
      // Arrange: Prepara a tarefa
      const task = {
        id: 'uuid-1',
        title: 'Tarefa 1',
        status: TaskStatus.PENDING,
      };

      // Act: Configura mocks
      mockRepository.findOneBy.mockResolvedValue(task);
      mockRepository.remove.mockResolvedValue(undefined);

      // Assert: Valida que a remoção foi bem-sucedida
      // Resolve para undefined significa sucesso (HTTP 204)
      await expect(service.remove('uuid-1')).resolves.toBeUndefined();
      // Verifica que remove foi chamado com a tarefa
      expect(mockRepository.remove).toHaveBeenCalledWith(task);
    });

    // Teste: verifica se NotFoundException é lançada ao deletar ID inexistente
    it('deve lançar NotFoundException ao deletar ID inexistente', async () => {
      // Act: Configura mock para retornar null
      mockRepository.findOneBy.mockResolvedValue(null);

      // Assert: Valida que a exceção é lançada
      await expect(service.remove('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });

    // Teste: verifica se remove() não é chamado se a tarefa não existe
    it('não deve chamar remove() se a tarefa não existir', async () => {
      // Act: Configura mock para retornar null
      mockRepository.findOneBy.mockResolvedValue(null);

      // Tenta remover tarefa inexistente
      try {
        await service.remove('id-inexistente');
      } catch {}

      // Assert: Valida que remove() NÃO foi chamado
      // O serviço deve lançar erro na busca e não prosseguir para deletar
      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});
