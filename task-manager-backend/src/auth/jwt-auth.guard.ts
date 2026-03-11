import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard — aplicado como decorator nas rotas que exigem autenticação.
 * Quando aplicado, o Passport executa a JwtStrategy automaticamente.
 * Se o token for inválido ou ausente, retorna 401 Unauthorized.
 * Uso: @UseGuards(JwtAuthGuard)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
