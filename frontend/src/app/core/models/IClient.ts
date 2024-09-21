export interface IClient {
    id: number;
    nomeCompleto: string;
    endereco: string;
    numeroTelefone: string;
    email: string;
    dataNascimento: Date;
    numeroIdentificacao: string;
    createdAt: Date | null;
    updatedAt: Date | null;
}