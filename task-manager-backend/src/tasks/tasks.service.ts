import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}

  create(dto: CreateTaskDto): Promise<Task> {
    const task = this.repo.create(dto);
    return this.repo.save(task);
  }

  async findAll(status?: TaskStatus, page = 1, limit = 10) {
  const where: FindOptionsWhere<Task> = {};
  if (status) where.status = status;

  const [data, total] = await this.repo.findAndCount({
    where,
    skip: (page - 1) * limit,
    take: limit,
    order: { createdAt: 'DESC' },
  });

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}

  async findOne(id: string): Promise<Task> {
    const task = await this.repo.findOneBy({ id });
    if (!task) throw new NotFoundException(`ERRO 404: Task ${id} não encontrada`);
    return task;
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, dto);
    return this.repo.save(task);
  }

  async remove(id: string): Promise<void> {
    const task = await this.findOne(id);
    await this.repo.remove(task);
  }
}
