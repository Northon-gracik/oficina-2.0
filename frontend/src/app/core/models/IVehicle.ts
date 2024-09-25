import { IClient } from "./IClient";

export interface IVehicle {
	id: number,
	marca: string,
	modelo: string,
	ano: string,
	km: string,
	placa: string,
	numeroChassi: string,
	cor: string,
	client: IClient
}