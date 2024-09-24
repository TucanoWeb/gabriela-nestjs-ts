import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServicoCadastramentoModule } from './servico-cadastramento/servico-cadastramento.module';
import { ServicoPagamentosModule } from './servico-pagamentos/servico-pagamentos.module';
import { ServicoAssinaturasValidasModule } from './servico-assinaturas-validas/servico-assinaturas-validas.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { Cliente, Aplicativo, Assinatura } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'XXXXXXXXX',
      port: 3306,
      username: 'XXXXXXXXX',
      password: 'XXXXXXXXX',
      database: 'XXXXXXXXX',
      entities: [Cliente, Aplicativo, Assinatura],
      synchronize: true,
    }),
    EventEmitterModule.forRoot(),
    ServicoCadastramentoModule,
    ServicoPagamentosModule,
    ServicoAssinaturasValidasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
