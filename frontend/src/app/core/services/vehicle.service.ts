import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IVehicle } from '../models/IVehicle';

const baseUrl = 'http://localhost:8080/vehicles';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient) { }

  public getAllVehicles = (): Promise<IVehicle[] | undefined> => {
    return this.http.get<IVehicle[]>(baseUrl).toPromise();
  }

  public getVehicleById = (id: number): Promise<IVehicle | undefined> => {
    return this.http.get<IVehicle>(`${baseUrl}/${id}`).toPromise();
  }

  public createVehicle = (Vehicle: Omit<IVehicle, 'id' | 'createdAt' | 'updatedAt'>): Promise<IVehicle | undefined> => {
    return this.http.post<IVehicle>(baseUrl, Vehicle).toPromise();
  }

  public updateVehicle = (id: number, Vehicle: Partial<IVehicle>): Promise<IVehicle | undefined> => {
    return this.http.put<IVehicle>(`${baseUrl}/${id}`, Vehicle).toPromise();
  }

  public deleteVehicle = (id: number): Promise<void> => {
    return this.http.delete<void>(`${baseUrl}/${id}`).toPromise();
  }

  public findBySearch = (search: string, idClient?: number): Promise<IVehicle[] | undefined> =>  this.http.get<IVehicle[]>(`${baseUrl}/search?${idClient ? `idClient=${idClient}&` : ''}searchTerm=${search}`).toPromise();
  
  
  public findByClientId = (clientId: number): Promise<IVehicle[] | undefined> => {
    return this.http.get<IVehicle[]>(`${baseUrl}/client/${clientId}`).toPromise();
  }
}
