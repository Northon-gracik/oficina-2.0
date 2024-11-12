import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CepService {

  constructor(private http: HttpClient) { }

  public getEnderecoByCep = (cep: string): Promise<any> => {
    return this.http.get(`https://viacep.com.br/ws/${cep}/json/`).toPromise();
  }
}
