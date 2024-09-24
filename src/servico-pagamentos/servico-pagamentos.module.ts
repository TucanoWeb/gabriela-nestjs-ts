import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicoPagamentosService } from './servico-pagamentos.service';
import { ServicoPagamentosController } from './servico-pagamentos.controller';
import { Pagamento } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '95.216.252.56',
      port: 3306,
      username: 'gabriela-payments',
      password: 'Fyt6PK4kFmxkCMdK',
      database: 'gabriela-payments',
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
