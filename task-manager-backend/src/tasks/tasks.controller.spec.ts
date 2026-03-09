import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './task.entity';
import { NotFoundException } from '@nestjs/common';

// Mock do TasksService — simula o service sem precisar do banco
const mockTasksService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  // ============================================================
  // CREATE
  // ============================================================
  describe('create()', () => {
    it('deve criar e retornar uma tarefa', async () => {
      const dto = { title: 'Estudar NestJS', status: TaskStatus.PENDING };
      const task: Task = { id: 'uuid-1', createdAt: new Date(), updatedAt: new Date(), ...dto } as Task;

      mockTasksService.create.mockResolvedValue(task);

      const resultado = await controller.create(dto);

      expect(mockTasksService.create).toHaveBeenCalledWith(dto);
      expect(resultado).toEqual(task);
    });
  });

  // ============================================================
  // FIND ALL
  // ============================================================
  describe('findAll()', () => {
    it('deve retornar a lista paginada de tarefas', async () => {
      const resposta = {
        data: [{ id: 'uuid-1', title: 'Tarefa 1', status: TaskStatus.PENDING }],
        total: 1,
        page: 1,
        totalPages: 1,
      };

      mockTasksService.findAll.mockResolvedValue(resposta);

      const resultado = await controller.findAll();

      expect(mockTasksService.findAll).toHaveBeenCalled();
      expect(resultado.data).toHaveLength(1);
      expect(resultado.total).toBe(1);
    });

    it('deve passar o filtro de status para o service', async () => {
      mockTasksService.findAll.mockResolvedValue({ data: [], total: 0, page: 1, totalPages: 0 });

      await controller.findAll(TaskStatus.PENDING);

      expect(mockTasksService.findAll).toHaveBeenCalledWith(
        TaskStatus.PENDING,
        undefined,
        undefined,
      );
    });
  });

  // ============================================================
  // FIND ONE
  // ============================================================
  describe('findOne()', () => {
    it('deve retornar uma tarefa pelo ID', async () => {
      const task = { id: 'uuid-1', title: 'Tarefa 1', status: TaskStatus.PENDING };

      mockTasksService.findOne.mockResolvedValue(task);

      const resultado = await controller.findOne('uuid-1');

      expect(mockTasksService.findOne).toHaveBeenCalledWith('uuid-1');
      expect(resultado).toEqual(task);
    });

    it('deve propagar NotFoundException quando tarefa não existir', async () => {
      mockTasksService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ============================================================
  // UPDATE
  // ============================================================
  describe('update()', () => {
    it('deve atualizar e retornar a tarefa modificada', async () => {
      const task = { id: 'uuid-1', title: 'Tarefa 1', status: TaskStatus.DONE };

      mockTasksService.update.mockResolvedValue(task);

      const resultado = await controller.update('uuid-1', { status: TaskStatus.DONE });

      expect(mockTasksService.update).toHaveBeenCalledWith('uuid-1', {
        status: TaskStatus.DONE,
      });
      expect(resultado.status).toBe(TaskStatus.DONE);
    });
  });

  // ============================================================
  // REMOVE
  // ============================================================
  describe('remove()', () => {
    it('deve remover a tarefa e retornar undefined (204)', async () => {
      mockTasksService.remove.mockResolvedValue(undefined);

      await expect(controller.remove('uuid-1')).resolves.toBeUndefined();
      expect(mockTasksService.remove).toHaveBeenCalledWith('uuid-1');
    });

    it('deve propagar NotFoundException ao remover ID inexistente', async () => {
      mockTasksService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove('id-inexistente')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
