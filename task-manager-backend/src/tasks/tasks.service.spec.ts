import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task, TaskStatus } from './task.entity';
import { NotFoundException } from '@nestjs/common';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findAndCount: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
};

describe('TasksService', () => {
  let service: TasksService;
  const userId = 'user-123';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);

    jest.clearAllMocks();
  });

  // ========================================================================================
  // TESTES DO MÉTODO CREATE
  // ========================================================================================
  describe('create()', () => {
    it('deve criar e retornar uma nova tarefa', async () => {
      const dto = {
        title: 'Estudar NestJS',
        description: 'Revisar DTOs e Pipes',
        status: TaskStatus.PENDING,
      };
      const taskCriada = { id: 'uuid-1', ...dto };

      mockRepository.create.mockReturnValue(taskCriada);
      mockRepository.save.mockResolvedValue(taskCriada);

      const resultado = await service.create(dto, userId);

      expect(mockRepository.create).toHaveBeenCalledWith({ ...dto, userId });
      expect(mockRepository.save).toHaveBeenCalledWith(taskCriada);
      expect(resultado).toEqual(taskCriada);
    });

    it('deve criar uma tarefa sem descrição (campo opcional)', async () => {
      const dto = { title: 'Tarefa simples', status: TaskStatus.PENDING };
      const taskCriada = { id: 'uuid-2', ...dto };

      mockRepository.create.mockReturnValue(taskCriada);
      mockRepository.save.mockResolvedValue(taskCriada);

      const resultado = await service.create(dto, userId);

      expect(resultado.title).toBe('Tarefa simples');
      expect(resultado.description).toBeUndefined();
    });
  });

  // ========================================================================================
  // TESTES DO MÉTODO FIND ALL
  // ========================================================================================
  describe('findAll()', () => {
    it('deve retornar todas as tarefas paginadas', async () => {
      const tasks = [
        { id: 'uuid-1', title: 'Tarefa 1', status: TaskStatus.PENDING },
        { id: 'uuid-2', title: 'Tarefa 2', status: TaskStatus.DONE },
      ];
      mockRepository.findAndCount.mockResolvedValue([tasks, 2]);

      const resultado = await service.findAll(userId);

      expect(resultado.data).toHaveLength(2);
      expect(resultado.total).toBe(2);
      expect(resultado.page).toBe(1);
      expect(resultado.totalPages).toBe(1);
    });

    it('deve retornar lista vazia quando não há tarefas', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 0]);

      const resultado = await service.findAll(userId);

      expect(resultado.data).toHaveLength(0);
      expect(resultado.total).toBe(0);
      expect(resultado.totalPages).toBe(0);
    });

    it('deve filtrar tarefas pelo status "pending"', async () => {
      const tasks = [
        { id: 'uuid-1', title: 'Tarefa 1', status: TaskStatus.PENDING },
      ];
      mockRepository.findAndCount.mockResolvedValue([tasks, 1]);

      const resultado = await service.findAll(userId, TaskStatus.PENDING);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId, status: TaskStatus.PENDING },
        }),
      );
      expect(resultado.data[0].status).toBe(TaskStatus.PENDING);
    });

    it('deve calcular corretamente o total de páginas', async () => {
      const tasks = Array(5).fill({
        id: 'uuid-1',
        title: 'Tarefa',
        status: TaskStatus.PENDING,
      });
      mockRepository.findAndCount.mockResolvedValue([tasks, 23]);

      const resultado = await service.findAll(userId, undefined, 1, 10);

      expect(resultado.totalPages).toBe(3);
    });

    it('deve aplicar paginação corretamente na página 2', async () => {
      mockRepository.findAndCount.mockResolvedValue([[], 20]);

      await service.findAll(userId, undefined, 2, 10);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 10,
          take: 10,
        }),
      );
    });
  });

  // ========================================================================================
  // TESTES DO MÉTODO FIND ONE
  // ========================================================================================
  describe('findOne()', () => {
    it('deve retornar uma tarefa pelo ID', async () => {
      const task = {
        id: 'uuid-1',
        title: 'Tarefa 1',
        status: TaskStatus.PENDING,
      };
      mockRepository.findOneBy.mockResolvedValue(task);

      const resultado = await service.findOne('uuid-1', userId);

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({
        id: 'uuid-1',
        userId,
      });
      expect(resultado).toEqual(task);
    });

    it('deve lançar NotFoundException quando o ID não existir', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('id-inexistente', userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve incluir a mensagem de erro correta no NotFoundException', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('id-inexistente', userId)).rejects.toThrow(
        'id-inexistente',
      );
    });
  });

  // ========================================================================================
  // TESTES DO MÉTODO UPDATE
  // ========================================================================================
  describe('update()', () => {
    it('deve atualizar o status da tarefa', async () => {
      const task = {
        id: 'uuid-1',
        title: 'Tarefa 1',
        status: TaskStatus.PENDING,
      };
      const taskAtualizada = { ...task, status: TaskStatus.DONE };

      mockRepository.findOneBy.mockResolvedValue(task);
      mockRepository.save.mockResolvedValue(taskAtualizada);

      const resultado = await service.update(
        'uuid-1',
        {
          status: TaskStatus.DONE,
        },
        userId,
      );

      expect(resultado.status).toBe(TaskStatus.DONE);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('deve atualizar o título da tarefa', async () => {
      const task = {
        id: 'uuid-1',
        title: 'Título antigo',
        status: TaskStatus.PENDING,
      };
      const taskAtualizada = { ...task, title: 'Título novo' };

      mockRepository.findOneBy.mockResolvedValue(task);
      mockRepository.save.mockResolvedValue(taskAtualizada);

      const resultado = await service.update(
        'uuid-1',
        {
          title: 'Título novo',
        },
        userId,
      );

      expect(resultado.title).toBe('Título novo');
    });

    it('deve lançar NotFoundException ao atualizar ID inexistente', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.update('id-inexistente', { status: TaskStatus.DONE }, userId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ========================================================================================
  // TESTES DO MÉTODO REMOVE
  // ========================================================================================
  describe('remove()', () => {
    it('deve remover a tarefa com sucesso', async () => {
      const task = {
        id: 'uuid-1',
        title: 'Tarefa 1',
        status: TaskStatus.PENDING,
      };

      mockRepository.findOneBy.mockResolvedValue(task);
      mockRepository.remove.mockResolvedValue(undefined);

      await expect(service.remove('uuid-1', userId)).resolves.toBeUndefined();
      expect(mockRepository.remove).toHaveBeenCalledWith(task);
    });

    it('deve lançar NotFoundException ao deletar ID inexistente', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove('id-inexistente', userId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('não deve chamar remove() se a tarefa não existir', async () => {
      mockRepository.findOneBy.mockResolvedValue(null);

      try {
        await service.remove('id-inexistente', userId);
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
      }

      expect(mockRepository.remove).not.toHaveBeenCalled();
    });
  });
});
