import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICreateCompany, ICreateUser, ILoginUser } from '../models/userModels';
import { catchError, map, Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080/';

@Injectable({
  providedIn: 'root',
})
export class UserHttpService {
  constructor(private http: HttpClient) {}

  public createUser(user: ICreateUser): Promise<any> {
    return this.http.post(baseUrl + 'users', user).toPromise();
  }
  public createCompany(company: ICreateCompany): Promise<any> {
    return this.http.post(baseUrl + 'companies/create', company).toPromise();
  }

  public loginUser(user: ILoginUser): Promise<any> {
    return this.http
      .post(baseUrl + 'users/login', user)
      .toPromise();
  }

  public getUserData(): Promise<any> {
    return this.http.get(baseUrl + 'users/recovery').toPromise();
  }

  public getCompanyData(): Promise<any> {
    return this.http.get(baseUrl + 'companies/recovery').toPromise();
  }

  public logoutCompany(): Promise<any> {
    return this.http.get(baseUrl + 'companies/logout').toPromise();
  }

  public loginInCompany(idCompany: string): Promise<any>{
    return this.http.post(baseUrl + 'companies/login', {idEmpresa: idCompany}).toPromise()
  }

  public getUserIsLogedObservable = (): Observable<boolean> => this.http.get(baseUrl + 'users/recovery').pipe(map(() => true), catchError(async () => false));

  public getCompanyIsLogedObservable = (): Observable<boolean> => this.http.get(baseUrl + 'companies/recovery').pipe(map(() => true), catchError(async () => false));
}
