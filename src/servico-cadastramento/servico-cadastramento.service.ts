import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, LessThan } from 'typeorm';
import { Cliente, Aplicativo, Assinatura } from '../entities';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ServicoCadastramentoService implements OnModuleInit {
  constructor(
    @InjectRepository(Cliente)
    private clientesRepository: Repository<Cliente>,

    @InjectRepository(Aplicativo)
    private aplicativosRepository: Repository<Aplicativo>,

    @InjectRepository(Assinatura)
    private assinaturasRepository: Repository<Assinatura>,
  ) {}

  async onModuleInit() {
    await this.popularBancoDeDados();
  }

  // Função para popular os dados
  private async popularBancoDeDados() {
    const totalClientes = await this.clientesRepository.count();
    const totalAplicativos = await this.aplicativosRepository.count();

    if (totalClientes === 0 && totalAplicativos === 0) {
      console.log('Populando o banco de dados...');

      // Inserindo 10 clientes
      const clientes = [
        { nome: 'Cliente 1', email: 'cliente1@email.com' },
        { nome: 'Cliente 2', email: 'cliente2@email.com' },
        { nome: 'Cliente 3', email: 'cliente3@email.com' },
        { nome: 'Cliente 4', email: 'cliente4@email.com' },
        { nome: 'Cliente 5', email: 'cliente5@email.com' },
        { nome: 'Cliente 6', email: 'cliente6@email.com' },
        { nome: 'Cliente 7', email: 'cliente7@email.com' },
        { nome: 'Cliente 8', email: 'cliente8@email.com' },
        { nome: 'Cliente 9', email: 'cliente9@email.com' },
        { nome: 'Cliente 10', email: 'cliente10@email.com' },
      ];

      for (const cliente of clientes) {
        const novoCliente = this.clientesRepository.create(cliente);
        await this.clientesRepository.save(novoCliente);
      }

      // Inserindo 5 aplicativos
      const aplicativos = [
        { nome: 'App 1', custoMensal: 19.99 },
        { nome: 'App 2', custoMensal: 9.99 },
        { nome: 'App 3', custoMensal: 14.99 },
        { nome: 'App 4', custoMensal: 29.99 },
        { nome: 'App 5', custoMensal: 24.99 },
      ];

      for (const app of aplicativos) {
        const novoApp = this.aplicativosRepository.create(app);
        await this.aplicativosRepository.save(novoApp);
      }

      console.log('Banco de dados populado com sucesso!');
    } else {
      console.log('O banco de dados já está populado.');
    }
  }

  // CLIENTS ==========================================
  // Clientes
  async listarClientes(): Promise<Cliente[]> {
    return this.clientesRepository.find();
  }

  async cadastrarCliente(nome: string, email: string): Promise<Cliente> {
    const novoCliente = this.clientesRepository.create({ nome, email });
    return this.clientesRepository.save(novoCliente);
  }

  async editarCliente(
    id: number,
    nome: string,
    email: string,
  ): Promise<Cliente> {
    const cliente = await this.clientesRepository.findOne({
      where: { codigo: id },
    });
    if (cliente) {
      cliente.nome = nome || cliente.nome;
      cliente.email = email || cliente.email;
      return this.clientesRepository.save(cliente);
    }
    return null;
  }

  // SUBSCRIPTIONS ==========================================
  // Criar assinatura
  async criarAssinatura(codCli: number, codApp: number): Promise<Assinatura> {
    const novaAssinatura = this.assinaturasRepository.create({
      codCli,
      codApp,
      inicioVigencia: new Date(),
      fimVigencia: new Date(new Date().setDate(new Date().getDate() + 7)), // 7 dias grátis
    });
    return this.assinaturasRepository.save(novaAssinatura);
  }

  // Assinatura por cliente
  async listarAssinaturasPorCliente(codCli: number): Promise<
    {
      codigoAssinatura: number;
      codigoCliente: number;
      codigoAplicativo: number;
      inicioVigencia: Date;
      fimVigencia: Date;
      status: string;
    }[]
  > {
    const assinaturas = await this.assinaturasRepository.find({
      where: { codCli },
    });
    const dataAtual = new Date();

    return assinaturas.map((assinatura) => {
      const status = assinatura.fimVigencia > dataAtual ? 'ATIVA' : 'CANCELADA';

      return {
        codigoAssinatura: assinatura.codigo,
        codigoCliente: assinatura.codCli,
        codigoAplicativo: assinatura.codApp,
        inicioVigencia: assinatura.inicioVigencia,
        fimVigencia: assinatura.fimVigencia,
        status,
      };
    });
  }

  // Listar assinaturas de acordo com o tipo
  async listarAssinaturasPorTipo(
    tipo: 'TODAS' | 'ATIVAS' | 'CANCELADAS',
  ): Promise<any[]> {
    let assinaturas: Assinatura[];

    const dataAtual = new Date();

    if (tipo === 'TODAS') {
      // Busca todas as assinaturas
      assinaturas = await this.assinaturasRepository.find();
    } else if (tipo === 'ATIVAS') {
      // Busca apenas assinaturas ativas (fimVigencia posterior à data atual)
      assinaturas = await this.assinaturasRepository.find({
        where: { fimVigencia: MoreThan(dataAtual) },
      });
    } else if (tipo === 'CANCELADAS') {
      // Busca apenas assinaturas canceladas (fimVigencia anterior à data atual)
      assinaturas = await this.assinaturasRepository.find({
        where: { fimVigencia: LessThan(dataAtual) },
      });
    }

    // Formata as assinaturas com o status apropriado
    return assinaturas.map((assinatura) => {
      const status = assinatura.fimVigencia > dataAtual ? 'ATIVA' : 'CANCELADA';
      return {
        codigoAssinatura: assinatura.codigo,
        codigoCliente: assinatura.codCli,
        codigoAplicativo: assinatura.codApp,
        inicioVigencia: assinatura.inicioVigencia,
        fimVigencia: assinatura.fimVigencia,
        status,
      };
    });
  }

  // Assinaturas por aplicativo
  async listarAssinaturasPorAplicativo(codApp: number): Promise<
    {
      codigoAssinatura: number;
      codigoCliente: number;
      codigoAplicativo: number;
      inicioVigencia: Date;
      fimVigencia: Date;
      status: string;
    }[]
  > {
    const assinaturas = await this.assinaturasRepository.find({
      where: { codApp },
    });
    const dataAtual = new Date();

    return assinaturas.map((assinatura) => {
      const status = assinatura.fimVigencia > dataAtual ? 'ATIVA' : 'CANCELADA';

      return {
        codigoAssinatura: assinatura.codigo,
        codigoCliente: assinatura.codCli,
        codigoAplicativo: assinatura.codApp,
        inicioVigencia: assinatura.inicioVigencia,
        fimVigencia: assinatura.fimVigencia,
        status,
      };
    });
  }

  // APP ==========================================
  // CUSTO
  async atualizarCusto(
    idAplicativo: number,
    novoCusto: number,
  ): Promise<Aplicativo> {
    const app = await this.aplicativosRepository.findOne({
      where: { codigo: idAplicativo },
    });
    if (app) {
      app.custoMensal = novoCusto;
      return this.aplicativosRepository.save(app);
    }
    return null;
  }

  async listarAplicativos(): Promise<Aplicativo[]> {
    return this.aplicativosRepository.find();
  }

  async cadastrarAplicativo(
    nome: string,
    custoMensal: number,
  ): Promise<Aplicativo> {
    const novoApp = this.aplicativosRepository.create({ nome, custoMensal });
    return this.aplicativosRepository.save(novoApp);
  }

  async editarAplicativo(
    id: number,
    nome: string,
    custoMensal: number,
  ): Promise<Aplicativo> {
    const app = await this.aplicativosRepository.findOne({
      where: { codigo: id },
    });
    if (app) {
      app.nome = nome || app.nome;
      app.custoMensal = custoMensal || app.custoMensal;
      return this.aplicativosRepository.save(app);
    }
    return null;
  }

  // Ouvindo o evento de pagamento para atualizar a assinatura
  @OnEvent('pagamento.realizado')
  async handlePagamentoRealizado(payload: {
    codAssinatura: number;
    valorPago: number;
    dataPagamento: Date;
  }) {
    const assinatura = await this.assinaturasRepository.findOne({
      where: { codigo: payload.codAssinatura },
    });
    if (assinatura) {
      // Estendendo a validade da assinatura em 1 mês
      assinatura.fimVigencia = new Date(
        assinatura.fimVigencia.setMonth(assinatura.fimVigencia.getMonth() + 1),
      );
      await this.assinaturasRepository.save(assinatura);

      console.log(
        `Assinatura ${payload.codAssinatura} atualizada após pagamento.`,
      );
    }
  }
}
