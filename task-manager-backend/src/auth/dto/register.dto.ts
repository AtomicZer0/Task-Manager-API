import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  /** Senha com mínimo de 6 caracteres */
  @IsString()
  @MinLength(6)
  password: string;
}
