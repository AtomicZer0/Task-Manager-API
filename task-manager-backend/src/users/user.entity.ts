import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

/**
 * Entidade User — representa a tabela "users" no banco.
 * Armazena as credenciais dos usuários que podem acessar a API.
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Email único usado como identificador de login */
  @Column({ unique: true })
  email: string;

  /** Senha armazenada como hash bcrypt — nunca em texto puro */
  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}
