import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, TaskStatus } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}

  create(dto: CreateTaskDto, userId: string): Promise<Task> {
    const task = this.repo.create({ ...dto, userId });
    return this.repo.save(task);
  }

  async findAll(userId: string, status?: TaskStatus, page = 1, limit = 10) {
    const where: FindOptionsWhere<Task> = { userId };
    if (status) where.status = status;

    const [data, total] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.repo.findOneBy({ id, userId });
    if (!task)
      throw new NotFoundException(`ERRO 404: Task ${id} não encontrada`);
    return task;
  }

  async update(id: string, dto: UpdateTaskDto, userId: string): Promise<Task> {
    const task = await this.findOne(id, userId);
    Object.assign(task, dto);
    return this.repo.save(task);
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id, userId);
    await this.repo.remove(task);
  }
}
