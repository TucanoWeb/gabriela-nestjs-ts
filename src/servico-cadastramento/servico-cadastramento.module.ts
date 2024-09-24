import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicoCadastramentoService } from './servico-cadastramento.service';
import { ServicoCadastramentoController } from './servico-cadastramento.controller';
import { Cliente, Aplicativo, Assinatura } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Aplicativo, Assinatura])],
  controllers: [ServicoCadastramentoController],
  providers: [ServicoCadastramentoService],
})
export class ServicoCadastramentoModule {}
