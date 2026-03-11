import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { Task } from './tasks/task.entity';
import { User } from './users/user.entity';

// @Module: Decorador que define a estrutura modular da aplicação
// Um módulo agrupa componentes relacionados (controllers, services, modules)
@Module({
  // imports: Array de módulos que este módulo depende
  imports: [
    // ConfigModule: Carrega variáveis de ambiente do arquivo .env
    // forRoot(): Configura o módulo com opções globais
    // isGlobal: true - Torna as variáveis de ambiente acessíveis em toda a aplicação sem precisar importar novamente
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // TypeOrmModule: Configura a conexão com o banco de dados PostgreSQL
    // forRootAsync: Permite usar valores dinâmicos (como variáveis de ambiente) na configuração
    TypeOrmModule.forRootAsync({
      // imports: Modulos necessários para a factory function (ConfigModule para usar ConfigService)
      imports: [ConfigModule],
      // inject: Injeta o ConfigService na função factory para acessar variáveis de ambiente
      inject: [ConfigService],
      // useFactory: Função que retorna a configuração de conexão do banco
      useFactory: (config: ConfigService) => ({
        // type: 'postgres' - Define o tipo de banco de dados (PostgreSQL)
        type: 'postgres',
        // host: Endereço do servidor PostgreSQL (ex: 'localhost' ou URL remota)
        host: config.get('DB_HOST'),
        // port: Porta do servidor PostgreSQL (padrão 5432, convertido para number com +)
        port: +config.getOrThrow('DB_PORT'),
        // username: Nome de usuário para autenticação no banco
        username: config.get('DB_USERNAME'),
        // password: Senha para autenticação no banco
        password: config.get('DB_PASSWORD'),
        // database: Nome do banco de dados a conectar
        database: config.get('DB_NAME'),
        // autoLoadEntities: true - Carrega automaticamente todas as entidades (@Entity) sem precisar registrá-las manualmente
        autoLoadEntities: true,
        // synchronize: true - Sincroniza automaticamente o schema do banco com as entidades
        // AVISO: Apenas usar em desenvolvimento, nunca em produção pois pode deletar dados
        entities: [Task, User],
        synchronize: true, // apenas utilizar em desenvolvimento
      }),
    }),

    // TasksModule: Módulo que contém toda a lógica de gerenciamento de tarefas
    // Inclui TasksController, TasksService, e a entidade Task
    TasksModule,
    AuthModule,
  ],

  // controllers: Array de controllers registrados neste módulo
  // AppController: Responsável pelas rotas HTTP da aplicação raiz
  controllers: [AppController],

  // providers: Array de services/providers que este módulo oferece
  // AppService: Oferece lógica de negócio para o controller
  providers: [AppService],
})
// Exporta a classe AppModule que será bootstrap da aplicação no main.ts
export class AppModule {}
