import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * Registra um novo usuário.
   * Verifica se o email já existe, faz hash da senha com bcrypt
   * e salva o usuário no banco.
   */
  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOneBy({ email: dto.email });
    if (exists) throw new ConflictException('Email já cadastrado');

    // O bcrypt gera um hash seguro com 10 rounds de salt
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
    });

    await this.userRepo.save(user);
    return { message: 'Usuário criado com sucesso' };
  }

  /**
   * Autentica um usuário e retorna um JWT.
   * Busca o usuário pelo email, compara a senha com o hash salvo
   * e gera um token assinado com o JWT_SECRET.
   */
  async login(dto: LoginDto) {
    const user = await this.userRepo.findOneBy({ email: dto.email });

    // bcrypt.compare compara a senha em texto puro com o hash salvo
    const isValid = user && (await bcrypt.compare(dto.password, user.password));
    if (!isValid) throw new UnauthorizedException('Email ou senha inválidos');

    // O payload é o que ficará dentro do token (visível, mas não alterável)
    const payload = { sub: user.id, email: user.email };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
