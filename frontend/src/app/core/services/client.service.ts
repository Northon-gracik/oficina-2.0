import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IClient } from '../models/IClient';

const baseUrl = 'http://localhost:8080/clients';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  public getAllClients = (): Promise<IClient[] | undefined> => {
    return this.http.get<IClient[]>(baseUrl).toPromise();
  }

  public getClientById = (id: number): Promise<IClient | undefined> => {
    return this.http.get<IClient>(`${baseUrl}/${id}`).toPromise();
  }

  public createClient = (client: Omit<IClient, 'id' | 'createdAt' | 'updatedAt'>): Promise<IClient | undefined> => {
    return this.http.post<IClient>(baseUrl, client).toPromise();
  }

  public updateClient = (id: number, client: Partial<IClient>): Promise<IClient | undefined> => {
    return this.http.put<IClient>(`${baseUrl}/${id}`, client).toPromise();
  }

  public deleteClient = (id: number): Promise<void> => {
    return this.http.delete<void>(`${baseUrl}/${id}`).toPromise();
  }

  public findByNumeroIdentificacao = (numeroIdentificacao: string): Promise<IClient | undefined> => {
    return this.http.get<IClient>(`${baseUrl}/numero-identificacao/${numeroIdentificacao}`).toPromise();
  }
}
