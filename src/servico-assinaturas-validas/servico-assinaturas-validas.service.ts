import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Assinatura } from '../entities';
import { Repository } from 'typeorm';

@Injectable()
export class ServicoAssinaturasValidasService {
  private cache: Map<number, boolean> = new Map(); // Cache para assinaturas válidas

  constructor(
    @InjectRepository(Assinatura)
    private assinaturasRepository: Repository<Assinatura>,

    private readonly httpService: HttpService,
  ) {}

  // Ouvindo o evento de pagamento para limpar o cache da assinatura
  @OnEvent('pagamento.realizado')
  handlePagamentoRealizado(payload: {
    codAssinatura: number;
    valorPago: number;
    dataPagamento: Date;
  }) {
    // Remove a assinatura da cache para que ela seja reavaliada na próxima consulta
    this.cache.delete(payload.codAssinatura);
    console.log(
      `Cache da assinatura ${payload.codAssinatura} limpo após pagamento.`,
    );
  }

  // Verifica se a assinatura é válida usando cache
  async verificarAssinaturaValida(codAss: number): Promise<boolean> {
    // Verifica na cache primeiro
    if (this.cache.has(codAss)) {
      console.log(`Cache hit para a assinatura ${codAss}`);
      return this.cache.get(codAss);
    }

    console.log(
      `Cache não localizado para a assinatura ${codAss}. Consultando ServicoCadastramento...`,
    );

    // Consulta o ServicoCadastramento
    const assinaturaValida = await this.consultarServicoCadastramento(codAss);

    // Armazena o resultado na cache para futuras consultas
    this.cache.set(codAss, assinaturaValida);

    return assinaturaValida;
  }

  // Consulta ao ServicoCadastramento
  private async consultarServicoCadastramento(
    codAss: number,
  ): Promise<boolean> {
    try {
      // Localiza o registro da assinatura para posteriormente obter o valor do cliente
      const subscriptionRegister = await this.assinaturasRepository.findOne({
        where: { codigo: codAss },
      });

      // Armazena valor do codCli para consultar o endpoint do cadastramento
      const codCli = subscriptionRegister.codCli;

      // Chamada HTTP ao ServicoCadastramento para verificar a validade da assinatura
      const response = await lastValueFrom(
        this.httpService.get(
          `http://localhost:3000/servcad/assinaturas/cliente/${codCli}`,
        ),
      );
      const status = response.data[0].status;
      return status === 'ATIVA' ? true : false;
    } catch (error) {
      console.error(
        `Erro ao consultar o ServicoCadastramento para assinatura ${codAss}:`,
        error,
      );
      return false; // Em caso de erro, considere a assinatura como inválida
    }
  }
}
