import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { TaskStatus } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FindOptionsWhere } from 'typeorm';

// @Injectable: Marca a classe como um provedor (service) que pode ser injetado em outros componentes
// Esta service contém toda a lógica de negócio para gerenciar tarefas
@Injectable()
export class TasksService {
  // Construtor com injeção de dependência do repositório TypeORM
  // @InjectRepository injecta a instância do repositório Task automaticamente pelo NestJS
  // this.repo é usado para operações CRUD no banco de dados
  constructor(@InjectRepository(Task) private repo: Repository<Task>) {}

  // Método CREATE (POST /tasks)
  // Responsável por criar uma nova tarefa no banco de dados
  // Parâmetro: dto - Objeto com dados validados (title, description, status)
  // Retorna: Promise<Task> - A tarefa criada com ID gerado pelo banco
  create(dto: CreateTaskDto): Promise<Task> {
    // this.repo.create() instancia uma nova entidade Task com os dados do DTO
    // Não salva no banco ainda, apenas cria a instância em memória
    const task = this.repo.create(dto);
    // this.repo.save() persiste a tarefa no banco de dados e retorna a tarefa com ID
    return this.repo.save(task);
  }

  // Método FIND ALL (GET /tasks)
  // Responsável por listar todas as tarefas com suporte a filtro de status e paginação
  // Parâmetros:
  //   - status?: TaskStatus (opcional) - Filtra tarefas por status (PENDING, IN_PROGRESS, DONE)
  //   - page = 1 (padrão) - Número da página para paginação
  //   - limit = 10 (padrão) - Quantidade de itens por página
  // Retorna: Objeto com dados paginados { data, total, page, limit, totalPages }
  async findAll(status?: TaskStatus, page = 1, limit = 10) {
    // Cria objeto vazio para armazenar condições da cláusula WHERE
    const where: FindOptionsWhere<Task> = {};
    // Se um status foi fornecido, adiciona-o como filtro
    if (status) where.status = status;

    // findAndCount retorna [array de tarefas, total de registros] que correspondem aos critérios
    // where: aplica o filtro de status (se fornecido)
    // skip: pula (page - 1) * limit registros (ex: página 2 com limit 10 pula 10 registros)
    // take: retorna apenas 'limit' registros
    // order: { createdAt: 'DESC' } ordena as tarefas pela data de criação em ordem decrescente (mais recentes primeiro)
    const [data, total] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    // Retorna objeto com informações de paginação
    // totalPages: Math.ceil(total / limit) calcula o número total de páginas
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  // Método FIND ONE (GET /tasks/:id)
  // Responsável por buscar uma tarefa específica pelo ID
  // Parâmetro: id - Identificador único (UUID) da tarefa
  // Retorna: Promise<Task> - A tarefa encontrada
  // Lança: NotFoundException - Se a tarefa não for encontrada
  async findOne(id: string): Promise<Task> {
    // findOneBy busca uma tarefa com o ID especificado
    const task = await this.repo.findOneBy({ id });
    // Se a tarefa não existe, lança exceção NotFoundException (HTTP 404)
    if (!task)
      throw new NotFoundException(`ERRO 404: Task ${id} não encontrada`);
    // Retorna a tarefa encontrada
    return task;
  }

  // Método UPDATE (PUT /tasks/:id)
  // Responsável por atualizar uma tarefa existente
  // Parâmetros:
  //   - id - Identificador único (UUID) da tarefa a atualizar
  //   - dto - Objeto com os campos a serem atualizados (title, description, status - todos opcionais)
  // Retorna: Promise<Task> - A tarefa atualizada
  // Lança: NotFoundException - Se a tarefa não for encontrada
  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    // Primeiro busca a tarefa existente (usa findOne que já valida se existe)
    const task = await this.findOne(id);
    // Object.assign mescla os dados do DTO na entidade existente
    // Apenas os campos fornecidos no DTO serão atualizados
    Object.assign(task, dto);
    // Salva a tarefa atualizada no banco de dados
    return this.repo.save(task);
  }

  // Método REMOVE (DELETE /tasks/:id)
  // Responsável por deletar uma tarefa do banco de dados
  // Parâmetro: id - Identificador único (UUID) da tarefa a deletar
  // Retorna: Promise<void> - Sem conteúdo (HTTP 204 No Content)
  // Lança: NotFoundException - Se a tarefa não for encontrada
  async remove(id: string): Promise<void> {
    // Primeiro busca a tarefa existente (usa findOne que já valida se existe)
    const task = await this.findOne(id);
    // this.repo.remove() remove a tarefa do banco de dados
    await this.repo.remove(task);
  }
}
