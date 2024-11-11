import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DashboardData } from '../models/dashboard.model';

const baseUrl = 'http://localhost:8080/relatorios';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  public getDashboardData = (): Promise<DashboardData> => {
    return this.http.get<any>(`${baseUrl}/dashboard`).toPromise();
  }


}
