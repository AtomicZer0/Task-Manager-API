import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from '../task.entity';
// Classe DTO (Data Transfer Object) para validar dados ao criar uma nova tarefa
// Os decoradores validam automaticamente os dados recebidos nas requisições HTTP
export class CreateTaskDto {
  // Decoradores para a propriedade 'title':
  // @IsString(): valida que o valor é uma string
  // @IsNotEmpty(): valida que o campo não é vazio (obrigatório)
  @IsString()
  @IsNotEmpty()
  // Propriedade: Título da tarefa (obrigatório)
  title: string;

  // Decoradores para a propriedade 'description':
  // @IsString(): valida que o valor é uma string
  // @IsOptional(): valida que o campo é opcional (pode não ser enviado)
  @IsString()
  @IsOptional()
  // Propriedade: Descrição da tarefa (opcional)
  description?: string;

  // Decoradores para a propriedade 'status':
  // @IsEnum(TaskStatus): valida que o valor é um dos valores do enum TaskStatus
  // @IsNotEmpty(): valida que o campo não é vazio (obrigatório)
  @IsEnum(TaskStatus)
  @IsNotEmpty()
  // Propriedade: Status inicial da tarefa (pending, in_progress, done) - obrigatório
  status: TaskStatus;
}
