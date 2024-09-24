import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagamento } from '../entities';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ServicoPagamentosService {
  constructor(
    @InjectRepository(Pagamento, 'paymentsConnection')
    private pagamentosRepository: Repository<Pagamento>,
    private eventEmitter: EventEmitter2, // EventEmitter para emitir eventos
  ) {}

  // Registrar pagamento e emitir evento
  async registrarPagamento(
    codAss: number,
    valorPago: number,
    dataPagamento: Date,
  ): Promise<void> {
    const novoPagamento = this.pagamentosRepository.create({
      codAssinatura: codAss,
      valorPago,
      dataPagamento,
    });

    // Salva o pagamento no banco de dados
    await this.pagamentosRepository.save(novoPagamento);

    // Emite um evento para notificar que o pagamento foi realizado
    this.eventEmitter.emit('pagamento.realizado', {
      codAssinatura: codAss,
      valorPago,
      dataPagamento,
    });

    console.log(
      `Pagamento registrado e evento emitido para a assinatura ${codAss}`,
    );
  }
}
