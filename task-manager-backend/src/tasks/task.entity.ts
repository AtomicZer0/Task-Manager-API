// Entity: marca uma classe como entidade do banco de dados
// PrimaryGeneratedColumn: define a chave primária com geração automática
// Column: define uma coluna do banco de dados
// CreateDateColumn: cria automaticamente uma coluna com data de criação
// UpdateDateColumn: cria automaticamente uma coluna com data de atualização
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

// Enum (enumeração) que define os possíveis status de uma tarefa
export enum TaskStatus {
  PENDING = 'pending', // Tarefa pendente (não iniciada)
  IN_PROGRESS = 'in_progress', // Tarefa em progresso (sendo feita)
  DONE = 'done', // Tarefa concluída
}

// Decorador @Entity: define que esta classe é uma entidade mapeada para a tabela 'tasks' no banco de dados
@Entity('tasks')
export class Task {
  // Decorador @PrimaryGeneratedColumn: define que 'id' é a chave primária com UUID auto-gerado
  @PrimaryGeneratedColumn('uuid')
  // Propriedade: Identificador único da tarefa (UUID - string)
  id: string;

  // Decorador @Column: define 'title' como uma coluna obrigatória do banco de dados
  @Column()
  // Propriedade: Título da tarefa (string obrigatória)
  title: string;

  // Decorador @Column com opção nullable: true - permite valores NULL
  @Column({ nullable: true })
  // Propriedade: Descrição da tarefa (string opcional, pode ser NULL)
  description: string;

  // Decorador @Column com configurações do tipo enum:
  // type: 'enum' - define que a coluna é do tipo enum
  // enum: TaskStatus - referencia o enum TaskStatus com os valores válidos
  // default: TaskStatus.PENDING - valor padrão quando uma tarefa é criada
  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  // Propriedade: Status da tarefa (pending, in_progress, done)
  status: TaskStatus;

  // Decorador @CreateDateColumn: cria automaticamente uma coluna de data e hora
  // Preenchida automaticamente com a data/hora atual quando a tarefa é criada
  @CreateDateColumn()
  // Propriedade: Data e hora de criação da tarefa (Date)
  createdAt: Date;

  // Decorador @UpdateDateColumn: cria automaticamente uma coluna de data e hora
  // Preenchida com a data/hora atual quando a tarefa é criada
  // Atualizada automaticamente toda vez que a tarefa é modificada
  @UpdateDateColumn()
  // Propriedade: Data e hora da última atualização da tarefa (Date)
  updatedAt: Date;
}
