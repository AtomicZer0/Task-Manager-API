// Controller: marca a classe como controladora
// Get, Post, Put, Delete: decoradores para métodos HTTP
// Body: acessa o corpo da requisição
// Param: acessa parâmetros de rota
// Query: acessa parâmetros de query string
// HttpCode: define o código HTTP de resposta
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  Query,
} from '@nestjs/common';
// Importa o serviço que contém a lógica de negócio
import { TasksService } from './tasks.service';
// Importa o DTO para validar dados ao criar tarefas
import { CreateTaskDto } from './dto/create-task.dto';
// Importa o DTO para validar dados ao atualizar tarefas
import { UpdateTaskDto } from './dto/update-task.dto';
// Importa o enum com os possíveis status de uma tarefa
import { TaskStatus } from './task.entity';

// Decorador @Controller: define que esta classe é um controlador
// 'tasks' é o prefixo de rota que será usado para todas as rotas desta classe
// Todas as rotas começarão com /tasks
@Controller('tasks')
export class TasksController {
  // Construtor que injeta o serviço de tarefas via dependência
  // O serviço contém toda a lógica de negócio para operações com tarefas
  constructor(private readonly tasksService: TasksService) {}

  // Decorador @Post: define que este método trata requisições POST
  // Rota: POST /tasks
  // Cria uma nova tarefa com dados validados pelo CreateTaskDto
  @Post()
  create(@Body() dto: CreateTaskDto) {
    // @Body() extrai o corpo da requisição e valida com o DTO
    return this.tasksService.create(dto);
  }

  // Decorador @Get: define que este método trata requisições GET
  // Rota: GET /tasks
  // Lista todas as tarefas com paginação e filtro opcional por status
  // Parâmetros de query string:
  //   - status: filtro opcional por status (pending, in_progress, done)
  //   - page: número da página (padrão: 1)
  //   - limit: quantidade de itens por página (padrão: 10)
  @Get()
  findAll(
    @Query('status') status?: TaskStatus,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.tasksService.findAll(status, page, limit);
  }

  // Decorador @Get(':id'): define que este método trata requisições GET com parâmetro dinâmico
  // Rota: GET /tasks/:id
  // Busca uma tarefa específica pelo seu ID único (UUID)
  @Get(':id')
  findOne(@Param('id') id: string) {
    // @Param('id') extrai o ID da rota (ex: /tasks/uuid-123)
    return this.tasksService.findOne(id);
  }

  // Decorador @Put(':id'): define que este método trata requisições PUT
  // Rota: PUT /tasks/:id
  // Atualiza uma tarefa existente com dados validados pelo UpdateTaskDto
  // Diferente do POST, este método espera uma tarefa existente
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    // @Param('id') extrai o ID da rota
    // @Body() extrai e valida os dados de atualização do DTO
    return this.tasksService.update(id, dto);
  }

  // Decorador @Delete(':id'): define que este método trata requisições DELETE
  // Rota: DELETE /tasks/:id
  // Remove (deleta) uma tarefa do banco de dados
  @Delete(':id')
  // Decorador @HttpCode(204): define o código HTTP da resposta como 204 No Content
  // 204 indica sucesso sem retornar conteúdo no corpo da resposta
  @HttpCode(204)
  remove(@Param('id') id: string) {
    // @Param('id') extrai o ID da rota
    return this.tasksService.remove(id);
  }
}
