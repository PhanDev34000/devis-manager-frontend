import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Client } from '../../store/clients/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private path = 'clients';

  constructor(private api: ApiService) {}

  getAll(): Observable<Client[]> {
    return this.api.get<Client[]>(this.path);
  }

  getById(id: string): Observable<Client> {
    return this.api.get<Client>(`${this.path}/${id}`);
  }

  create(client: Omit<Client, '_id' | 'createdAt'>): Observable<Client> {
    return this.api.post<Client>(this.path, client);
  }

  update(id: string, client: Partial<Client>): Observable<Client> {
    return this.api.put<Client>(`${this.path}/${id}`, client);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(`${this.path}/${id}`);
  }
}