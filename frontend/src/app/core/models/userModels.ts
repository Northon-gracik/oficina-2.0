export interface ICreateUser {
  password: string;
  email: string;
  nome: string;
  cpf: string;
}

export interface ILoginUser {
  password: string;
  email: string;
}

export interface ICreateCompany {
  nome: string;
  cnpj: string;
}
