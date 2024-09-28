import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Raster } from '../models/raster';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly baseUrl = environment.apiURL;

  http = inject(HttpClient)

  getRaster(): Observable<Raster> {
    return this.http.get<Raster>(`${this.baseUrl}/raster`);
  }
  

  constructor() { }
}
