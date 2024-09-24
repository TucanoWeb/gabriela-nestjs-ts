import { Controller, Get, Param } from '@nestjs/common';
import { ServicoAssinaturasValidasService } from './servico-assinaturas-validas.service';

@Controller('assinvalidas')
export class ServicoAssinaturasValidasController {
  constructor(
    private readonly servicoAssinaturasValidasService: ServicoAssinaturasValidasService,
  ) {}

  @Get(':codAss')
  verificarAssinaturaValida(@Param('codAss') codAss: number) {
    return this.servicoAssinaturasValidasService.verificarAssinaturaValida(
      codAss,
    );
  }
}
