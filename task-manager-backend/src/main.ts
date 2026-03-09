import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

// Função bootstrap: Inicializa e configura a aplicação NestJS
async function bootstrap() {
  // NestFactory.create(): Cria uma instância da aplicação NestJS usando AppModule
  const app = await NestFactory.create(AppModule);

  // useGlobalPipes: Registra pipes globais que são aplicados a todas as requisições
  // ValidationPipe: Valida automaticamente dados recebidos usando decoradores do class-validator
  // Se dados não correspondem ao DTO, retorna erro 400 automaticamente
  app.useGlobalPipes(new ValidationPipe());

  // enableCors: Habilita CORS (Cross-Origin Resource Sharing) para requisições de origem externa
  // origin: 'http://localhost:3000' - Permite requisições apenas do frontend rodando em localhost:3000
  // Sem CORS, o frontend não pode fazer requisições para o backend
  app.enableCors({
    origin: 'http://localhost:3000',
  });

  // app.listen(): Inicia o servidor na porta 3001
  // A aplicação aguarda requisições HTTP na porta 3001 (ex: http://localhost:3001)
  await app.listen(3001);
}

// Chama a função bootstrap para iniciar a aplicação
bootstrap();
