import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ServicoCadastramentoService } from './servico-cadastramento.service';

@Controller('servcad')
export class ServicoCadastramentoController {
  constructor(
    private readonly servicoCadastramentoService: ServicoCadastramentoService,
  ) {}

  // CLIENTS ==========================================
  // Listar clientes
  @Get('clientes')
  listarClientes() {
    return this.servicoCadastramentoService.listarClientes();
  }

  // Cadastrar cliente
  @Post('clientes')
  cadastrarCliente(@Body() body: { nome: string; email: string }) {
    return this.servicoCadastramentoService.cadastrarCliente(
      body.nome,
      body.email,
    );
  }

  // Editar cliente
  @Patch('clientes/:id')
  editarCliente(
    @Param('id') id: number,
    @Body() body: { nome: string; email: string },
  ) {
    return this.servicoCadastramentoService.editarCliente(
      id,
      body.nome,
      body.email,
    );
  }

  // SUBSCRIPTIONS ==========================================
  // Criar assinatura
  @Post('assinaturas')
  criarAssinatura(@Body() body: { codCli: number; codApp: number }) {
    return this.servicoCadastramentoService.criarAssinatura(
      body.codCli,
      body.codApp,
    );
  }

  // Listar assinatura
  @Get('assinaturas/cliente/:codCli')
  listarAssinaturasPorCliente(@Param('codCli') codCli: number) {
    return this.servicoCadastramentoService.listarAssinaturasPorCliente(codCli);
  }

  // Listar assinatura por aplicativo
  @Get('assinaturas/aplicativo/:codApp')
  listarAssinaturasPorAplicativo(@Param('codApp') codApp: number) {
    return this.servicoCadastramentoService.listarAssinaturasPorAplicativo(
      codApp,
    );
  }

  // Listar assinaturas de acordo com o tipo
  @Get('assinaturas/:tipo')
  listarAssinaturasPorTipo(
    @Param('tipo') tipo: 'TODAS' | 'ATIVAS' | 'CANCELADAS',
  ) {
    return this.servicoCadastramentoService.listarAssinaturasPorTipo(tipo);
  }

  // APPS ==========================================
  // Listar Aplicativos
  @Get('aplicativos')
  listarAplicativos() {
    return this.servicoCadastramentoService.listarAplicativos();
  }

  // Atualizar Custo Aplicativo
  @Patch('aplicativos/:idAplicativo')
  atualizarCusto(
    @Param('idAplicativo') id: number,
    @Body() body: { custo: number },
  ) {
    return this.servicoCadastramentoService.atualizarCusto(id, body.custo);
  }

  // Cadastrar aplicativo
  @Post('aplicativos')
  cadastrarAplicativo(@Body() body: { nome: string; custoMensal: number }) {
    return this.servicoCadastramentoService.cadastrarAplicativo(
      body.nome,
      body.custoMensal,
    );
  }

  // Editar aplicativo
  @Patch('aplicativos/:id')
  editarAplicativo(
    @Param('id') id: number,
    @Body() body: { nome: string; custoMensal: number },
  ) {
    return this.servicoCadastramentoService.editarAplicativo(
      id,
      body.nome,
      body.custoMensal,
    );
  }
}
