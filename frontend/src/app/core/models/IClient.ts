export interface IClient {
    id: number;
    nomeCompleto: string;
    endereco: string | IEndereco;
    numeroTelefone: string;
    email: string;
    dataNascimento: Date;
    numeroIdentificacao: string;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface IEndereco {
    // id: number;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    complemento: string;
}