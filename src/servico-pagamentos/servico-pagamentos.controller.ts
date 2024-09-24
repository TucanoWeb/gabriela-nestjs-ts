import { Controller, Post, Body } from '@nestjs/common';
import { ServicoPagamentosService } from './servico-pagamentos.service';

@Controller('pagamentos')
export class ServicoPagamentosController {
  constructor(
    private readonly servicoPagamentosService: ServicoPagamentosService,
  ) {}

  @Post('registrarpagamento')
  registrarPagamento(
    @Body() body: { codAss: number; valorPago: number; dataPagamento: Date },
  ) {
    return this.servicoPagamentosService.registrarPagamento(
      body.codAss,
      body.valorPago,
      body.dataPagamento,
    );
  }
}
