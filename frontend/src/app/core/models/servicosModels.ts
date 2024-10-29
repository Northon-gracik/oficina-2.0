import { Timestamp } from "rxjs";
import { IVehicle } from "./IVehicle";



export interface IAgendamento {
    dataAgendamento: Date;	
    descricaoProblema: string;
}

export interface IInspecao {
    id: number;
    dataInspecao: Date;
    responsavelInspecao: string;
    observacoes: string;
    quilometragem: number;
    // checklistInspecao: IChecklistInspecao;
    checklistInspecao: { [key: string]: boolean };
    nivelCombustivel: number;
}
export interface IPeca {
    id: number;
    nome: string;
    descricao: string;
    valorUnitario: number;
    quantidade: number;
    partNumber: string;
}
export interface IItemAFazer {
    id: number;
    descricao: string;
    tipoMecanico: string;
    statusManutencao: StatusManutencaoEnum;
    tipoManutencao: string;
    valorTotalPecas: number;
    valorMaoDeObra: number;
    tempoEstimado: number | null;
    horaInicio: Date | null;
    horaFim: Date;
    pecas: IPeca[];
}
export interface IOrcamento {
    id: number;
    dataCriacao: Date;
    dataPrevista: Date;
    dataValidade: Date;
    custoTotalEstimado: number;
    status: StatusOrcamentoEnum;
    responsavelEmissao: string;
    itensAFazer: IItemAFazer[];
}
export interface IManutencao {
    id: number;
    dataInicio: Date;
    dataConclusao: Date;
    descricaoDetalhada: string;
    custosReais: number;
    comentariosObservacoes: string;
    tecnicoResponsavel: string;
    itensAFazer: IItemAFazer[];
}
export interface IEntrega {
    id: number;
    responsavelEntrega: string;
    dataEntrega: Date;
    observacoesEntrega: string;
    quilometragemEntrega: number;
}
export interface IServico {
    id: number;
    vehicle: IVehicle;
    descricao: string | null;
    dataInicio: Date;	
    dataConclusao: Date;	
    status: string;
    mecanico: string | null;
    custoEstimado: number;
    custoFinal: number | null;
    tempoEstimado: number | null;
    tempoReal: number | null;
    formaPagamento: string | null;
    statusPagamento: StatusPagamentoEnum;
    valorPagamento: number | null;
    agendamento: IAgendamento;
    inspecaoEntrada: IInspecao;
    orcamento: IOrcamento;
    manutencao: IManutencao;
    inspecaoSaida: IInspecao;
    entrega: IEntrega;
}

export interface IServicoListagem {
    id: number,
    cliente: string,
    veiculo: string,
    dataInicio: Date;	
    status: String
}

export const formatServicoToListagem = (servico: IServico): IServicoListagem => {
    return {
        id: servico.id,
        cliente: servico.vehicle?.client.nomeCompleto || 'Cliente não informado',
        veiculo: servico.vehicle ? `${servico.vehicle.marca} ${servico.vehicle.modelo} - ${servico.vehicle.placa}` : 'Veículo não informado',
        dataInicio: servico.dataInicio,
        status: servico.status
    }
}

export enum StatusAgendamentoEnum {
    PENDENTE = "PENDENTE",
    CONFIRMADO = "CONFIRMADO",
    CANCELADO = "CANCELADO"
}
export enum StatusManutencaoEnum {
    PENDENTE = 'PENDENTE', EM_ANDAMENTO = 'EM_ANDAMENTO', CONCLUIDA = 'CONCLUIDA', CANCELADA = 'CANCELADA'
}

export enum StatusOrcamentoEnum {
    PENDENTE = "PENDENTE", GERADO = "GERADO", APROVADO = "APROVADO", REPROVADO = "REPROVADO"
}

export enum StatusPagamentoEnum {
    PAGO_TOTALMENTE = "PAGO_TOTALMENTE",
    PENDENTE = "PENDENTE",
    PAGO_PARCIALMENTE = "PAGO_PARCIALMENTE"
}
