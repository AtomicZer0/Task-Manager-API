import { IsString, IsOptional, IsEnum } from 'class-validator';
import { TaskStatus } from '../task.entity';
// Classe DTO (Data Transfer Object) para validar dados ao atualizar uma tarefa existente
// Diferente do CreateTaskDto, TODOS os campos são opcionais
// Permite que o usuário escolha quais campos deseja atualizar (atualização parcial)
export class UpdateTaskDto {
  // Decoradores para a propriedade 'title':
  // @IsString(): valida que o valor é uma string
  // @IsOptional(): valida que o campo é opcional (pode não ser enviado)
  @IsString()
  @IsOptional()
  // Propriedade: Novo título da tarefa (opcional)
  title?: string;

  // Decoradores para a propriedade 'description':
  // @IsString(): valida que o valor é uma string
  // @IsOptional(): valida que o campo é opcional (pode não ser enviado)
  @IsString()
  @IsOptional()
  // Propriedade: Nova descrição da tarefa (opcional)
  description?: string;

  // Decoradores para a propriedade 'status':
  // @IsEnum(TaskStatus): valida que o valor é um dos valores do enum TaskStatus
  // @IsOptional(): valida que o campo é opcional (pode não ser enviado)
  @IsEnum(TaskStatus)
  @IsOptional()
  // Propriedade: Novo status da tarefa (pending, in_progress, done) - opcional
  status?: TaskStatus;
}
