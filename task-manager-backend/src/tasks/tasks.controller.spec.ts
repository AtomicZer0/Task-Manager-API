import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.entity';
import { NotFoundException } from '@nestjs/common';

// Mock do TasksService — simula o serviço sem precisar do banco de dados real
// Cada método é um jest.fn() que pode ser configurado e monitorado nos testes
const mockTasksService = {
  create: jest.fn(), // Mock do método create
  findAll: jest.fn(), // Mock do método findAll
  findOne: jest.fn(), // Mock do método findOne
  update: jest.fn(), // Mock do método update
  remove: jest.fn(), // Mock do método remove
};

// describe: Agrupa todos os testes relacionados ao TasksController
describe('TasksController', () => {
  // Variável para armazenar a instância do controlador durante os testes
  let controller: TasksController;

  // beforeEach: Hook que executa antes de cada teste
  // Configura o módulo de teste com o controlador e o serviço mockado
  beforeEach(async () => {
    // Cria um módulo de teste com o controlador
    const module: TestingModule = await Test.createTestingModule({
      // Define o controlador a ser testado
      controllers: [TasksController],
      // Define os provedores (serviços)
      providers: [
        {
          // Injeta o mock no lugar do serviço real
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    // Obtém a instância do controlador do módulo de teste
    controller = module.get<TasksController>(TasksController);
    // Limpa todos os mocks para evitar dados de testes anteriores
    jest.clearAllMocks();
  });

  // Teste básico: verifica se o controlador foi criado
  it('deve estar definido', () => {
    // Assert: valida que o controlador foi instanciado corretamente
    expect(controller).toBeDefined();
  });

  // ========================================================================================
  // TESTES DO MÉTODO CREATE
  // ========================================================================================
  describe('create()', () => {
    // Teste: verifica se uma tarefa é criada corretamente
    it('deve criar e retornar uma tarefa', async () => {
      // Arrange: Prepara os dados do teste
      const dto = { title: 'Estudar NestJS', status: TaskStatus.PENDING };
      // Cria uma tarefa simulada com ID e datas
      const task: Task = {
        id: 'uuid-1',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...dto,
      } as Task;

      // Act: Configura o mock para retornar a tarefa
      mockTasksService.create.mockResolvedValue(task);

      // Executa o método do controlador
      const resultado = await controller.create(dto);

      // Assert: Valida os resultados
      // Verifica que o método do service foi chamado com o DTO correto
      expect(mockTasksService.create).toHaveBeenCalledWith(dto);
      // Verifica que o resultado é a tarefa esperada
      expect(resultado).toEqual(task);
    });
  });

  // ========================================================================================
  // TESTES DO MÉTODO FIND ALL
  // ========================================================================================
  describe('findAll()', () => {
    // Teste: verifica se a lista paginada de tarefas é retornada
    it('deve retornar a lista paginada de tarefas', async () => {
      // Arrange: Prepara a resposta esperada com paginação
      const resposta = {
        data: [{ id: 'uuid-1', title: 'Tarefa 1', status: TaskStatus.PENDING }],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      // Act: Configura o mock para retornar a resposta
      mockTasksService.findAll.mockResolvedValue(resposta);

      // Executa o método do controlador
      const resultado = await controller.findAll();

      // Assert: Valida os resultados
      // Verifica que o método do service foi chamado
      expect(mockTasksService.findAll).toHaveBeenCalled();
      // Verifica que o array de dados tem o tamanho esperado
      expect(resultado.data).toHaveLength(1);
      // Verifica que o total de tarefas está correto
      expect(resultado.total).toBe(1);
    });

    // Teste: verifica se o filtro de status é passado corretamente
    it('deve passar o filtro de status para o service', async () => {
      // Arrange: Configura o mock para retornar lista vazia
      mockTasksService.findAll.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        totalPages: 0,
      });

      // Act: Chama o método com um filtro de status
      await controller.findAll(TaskStatus.PENDING);

      // Assert: Valida que o status foi passado para o service
      expect(mockTasksService.findAll).toHaveBeenCalledWith(
        TaskStatus.PENDING,
        undefined,
        undefined,
      );
    });
  });

  // ========================================================================================
  // TESTES DO MÉTODO FIND ONE
  // ========================================================================================
  describe('findOne()', () => {
    // Teste: verifica se uma tarefa é retornada pelo ID
    it('deve retornar uma tarefa pelo ID', async () => {
      // Arrange: Prepara os dados
      const task = {
        id: 'uuid-1',
        title: 'Tarefa 1',
        status: TaskStatus.PENDING,
      };

      // Act: Configura o mock para retornar a tarefa
      mockTasksService.findOne.mockResolvedValue(task);

      // Executa o método do controlador
      const resultado = await controller.findOne('uuid-1');

      // Assert: Valida os resultados
      // Verifica que o método foi chamado com o ID correto
      expect(mockTasksService.findOne).toHaveBeenCalledWith('uuid-1');
      // Verifica que o resultado é a tarefa esperada
      expect(resultado).toEqual(task);
    });

    // Teste: verifica se NotFoundException é lançada quando a tarefa não existe
    it('deve propagar NotFoundException quando tarefa não existir', async () => {
      // Arrange: Configura o mock para rejeitar com NotFoundException
      mockTasksService.findOne.mockRejectedValue(new NotFoundException());

      // Assert: Valida que a exceção é lançada
      await expect(controller.findOne('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ========================================================================================
  // TESTES DO MÉTODO UPDATE
  // ========================================================================================
  describe('update()', () => {
    // Teste: verifica se uma tarefa é atualizada corretamente
    it('deve atualizar e retornar a tarefa modificada', async () => {
      // Arrange: Prepara os dados
      const task = { id: 'uuid-1', title: 'Tarefa 1', status: TaskStatus.DONE };

      // Act: Configura o mock para retornar a tarefa atualizada
      mockTasksService.update.mockResolvedValue(task);

      // Executa o método do controlador
      const resultado = await controller.update('uuid-1', {
        status: TaskStatus.DONE,
      });

      // Assert: Valida os resultados
      // Verifica que o método foi chamado com os parâmetros corretos
      expect(mockTasksService.update).toHaveBeenCalledWith('uuid-1', {
        status: TaskStatus.DONE,
      });
      // Verifica que o status foi atualizado corretamente
      expect(resultado.status).toBe(TaskStatus.DONE);
    });
  });

  // ========================================================================================
  // TESTES DO MÉTODO REMOVE
  // ========================================================================================
  describe('remove()', () => {
    // Teste: verifica se uma tarefa é removida corretamente (retorna 204)
    it('deve remover a tarefa e retornar undefined (204)', async () => {
      // Arrange: Configura o mock para não retornar nada
      mockTasksService.remove.mockResolvedValue(undefined);

      // Assert: Valida que a tarefa foi removida sem erro
      await expect(controller.remove('uuid-1')).resolves.toBeUndefined();
      // Verifica que o método foi chamado com o ID correto
      expect(mockTasksService.remove).toHaveBeenCalledWith('uuid-1');
    });

    // Teste: verifica se NotFoundException é lançada ao remover ID inexistente
    it('deve propagar NotFoundException ao remover ID inexistente', async () => {
      // Arrange: Configura o mock para rejeitar com NotFoundException
      mockTasksService.remove.mockRejectedValue(new NotFoundException());

      // Assert: Valida que a exceção é lançada
      await expect(controller.remove('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
