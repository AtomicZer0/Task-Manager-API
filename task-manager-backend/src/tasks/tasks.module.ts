import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

// Decorador @Module: Define que esta classe é um módulo do NestJS
// Um módulo agrupa componentes relacionados (controladores, serviços, etc.)
@Module({
  // imports: Lista de módulos importados
  // TypeOrmModule.forFeature([Task]): Registra a entidade Task no banco de dados
  // Permite que o repositório de Task seja injetado em serviços
  imports: [TypeOrmModule.forFeature([Task])],
  // controllers: Define os controladores que serão disponibilizados por este módulo
  // TasksController gerencia todas as rotas HTTP para tarefas
  controllers: [TasksController],
  // providers: Define os provedores (serviços) que este módulo oferece
  // Pode ser injetado em outros módulos ou controladores
  // TasksService contém toda a lógica de negócio para operações com tarefas
  providers: [TasksService],
})
// Classe que representa este módulo
export class TasksModule {}
