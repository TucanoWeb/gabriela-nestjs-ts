import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicoAssinaturasValidasService } from './servico-assinaturas-validas.service';
import { ServicoAssinaturasValidasController } from './servico-assinaturas-validas.controller';
import { HttpModule } from '@nestjs/axios';
import { Assinatura } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Assinatura]), HttpModule],
  providers: [ServicoAssinaturasValidasService],
  controllers: [ServicoAssinaturasValidasController],
})
export class ServicoAssinaturasValidasModule {}
