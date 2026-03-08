import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, TaskStatus } from './task.entity';
import { NotFoundException } from '@nestjs/common';

const mockRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    jest.clearAllMocks();
  });

  // --- CRIAR ---
  describe('create()', () => {
    it('deve criar e retornar uma tarefa', async () => {
      const dto = { title: 'Estudar NestJS', status: TaskStatus.PENDING };
      const task = { id: 'uuid-1', ...dto };

      mockRepo.create.mockReturnValue(task);
      mockRepo.save.mockResolvedValue(task);

      const result = await service.create(dto);

      expect(mockRepo.create).toHaveBeenCalledWith(dto);
      expect(mockRepo.save).toHaveBeenCalledWith(task);
      expect(result).toEqual(task);
    });
  });

  // --- LISTAR ---
  describe('findAll()', () => {
    it('deve retornar todas as tarefas com paginação', async () => {
      const tasks = [
        { id: 'uuid-1', title: 'Tarefa 1', status: TaskStatus.PENDING },
        { id: 'uuid-2', title: 'Tarefa 2', status: TaskStatus.DONE },
      ];
      mockRepo.findAndCount.mockResolvedValue([tasks, 2]);

      const result = await service.findAll();

      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(1);
    });

    it('deve filtrar tarefas por status', async () => {
      const tasks = [{ id: 'uuid-1', title: 'Tarefa 1', status: TaskStatus.PENDING }];
      mockRepo.findAndCount.mockResolvedValue([tasks, 1]);

      const result = await service.findAll(TaskStatus.PENDING);

      expect(mockRepo.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: TaskStatus.PENDING } }),
      );
      expect(result.data[0].status).toBe(TaskStatus.PENDING);
    });
  });

  // --- BUSCAR POR ID ---
  describe('findOne()', () => {
    it('deve retornar uma tarefa pelo ID', async () => {
      const task = { id: 'uuid-1', title: 'Tarefa 1', status: TaskStatus.PENDING };
      mockRepo.findOneBy.mockResolvedValue(task);

      const result = await service.findOne('uuid-1');
      expect(result).toEqual(task);
    });

    it('deve lançar NotFoundException se a tarefa não existir', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('id-inexistente')).rejects.toThrow(NotFoundException);
    });
  });

  // --- ATUALIZAR ---
  describe('update()', () => {
    it('deve atualizar e retornar a tarefa modificada', async () => {
      const task = { id: 'uuid-1', title: 'Tarefa 1', status: TaskStatus.PENDING };
      const updated = { ...task, status: TaskStatus.DONE };

      mockRepo.findOneBy.mockResolvedValue(task);
      mockRepo.save.mockResolvedValue(updated);

      const result = await service.update('uuid-1', { status: TaskStatus.DONE });
      expect(result.status).toBe(TaskStatus.DONE);
    });
  });

  // --- DELETAR ---
  describe('remove()', () => {
    it('deve remover a tarefa sem retornar conteúdo', async () => {
      const task = { id: 'uuid-1', title: 'Tarefa 1', status: TaskStatus.PENDING };

      mockRepo.findOneBy.mockResolvedValue(task);
      mockRepo.remove.mockResolvedValue(undefined);

      await expect(service.remove('uuid-1')).resolves.toBeUndefined();
      expect(mockRepo.remove).toHaveBeenCalledWith(task);
    });

    it('deve lançar NotFoundException ao deletar ID inexistente', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.remove('id-inexistente')).rejects.toThrow(NotFoundException);
    });
  });
});
