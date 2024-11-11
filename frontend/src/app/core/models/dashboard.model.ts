// dashboard.model.ts

export interface ItemMaiorCusto {
    descricaoItem: string;
    valorTotal: number;
}

export interface CustoMedioCliente {
    clienteNome: string;
    precoMedio: number;
}

export interface StatusServico {
    status: string;
    quantidade: number;
}

export interface ItemAFazerTipo {
    tipoManutencao: string;
    quantidade: number;
}

export interface CustoMedioVeiculo {
    nomeVeiculo: string;
    precoMedio: number;
}

export interface TarefasMecanico {
    nomeMecanico: string;
    tarefasConcluidas: number;
    custoTotal: number;
}

export interface CustoMedio {
    custoMedio: number;
}

export interface CustoMedioMarcaVeiculo {
    nomeVeiculo: string;
    precoMedio: number;
}

export interface ItemAFazerStatus {
    descricao: string;
    status: string;
    quantidade: number;
}

export interface DashboardData {
    itensMaiorCusto: ItemMaiorCusto[];
    custoMedioCliente: CustoMedioCliente[];
    statusServico: StatusServico[];
    itemAFazerTipo: ItemAFazerTipo[];
    custoMedioVeiculo: CustoMedioVeiculo[];
    tarefasMecanico: TarefasMecanico[];
    custoMedioMarcaVeiculo: CustoMedioMarcaVeiculo[];
    itensAFazerStatus: ItemAFazerStatus[];
    custoMedioDosVeiculos: number,
	custoMedioDosCliente: number,
	custoMedio: number,
	custoMedioDasMarcas: number
}
