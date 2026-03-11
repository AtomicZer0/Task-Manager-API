import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/**
 * JwtStrategy — executada automaticamente pelo Passport em toda rota protegida.
 * Extrai o token do header "Authorization: Bearer <token>",
 * valida a assinatura com o JWT_SECRET e retorna o payload decodificado.
 * O payload retornado fica disponível como req.user em todo controller.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      // Extrai o token do header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Rejeita tokens expirados
      ignoreExpiration: false,
      // Chave secreta para verificar a assinatura
      secretOrKey: config.get<string>('JWT_SECRET')!,
    });
  }

  /**
   * Chamado automaticamente após validar a assinatura do token.
   * O objeto retornado aqui é injetado como req.user nos controllers.
   */
  validate(payload: { sub: string; email: string }) {
    if (!payload) throw new UnauthorizedException();
    return { id: payload.sub, email: payload.email };
  }
}
