import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicoPagamentosService } from './servico-pagamentos.service';
import { ServicoPagamentosController } from './servico-pagamentos.controller';
import { Pagamento } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'XXXXXXXXX',
      port: 3306,
      username: 'XXXXXXXXX',
      password: 'XXXXXXXXX',
      database: 'XXXXXXXXX',
      entities: [Pagamento],
      synchronize: true,
      name: 'paymentsConnection', // Nome único para a conexão de pagamentos - necessário pois está sendo criada uma segunda conexão, diferente da conexão criada em global (app.module.ts)
    }),
    TypeOrmModule.forFeature([Pagamento], 'paymentsConnection'),
  ],
  controllers: [ServicoPagamentosController],
  providers: [ServicoPagamentosService],
})
export class ServicoPagamentosModule {}
