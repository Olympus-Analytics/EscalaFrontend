import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Graph } from '../models/graph';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly baseUrl = environment.apiURL + '/api/data';

  http = inject(HttpClient)

  endPoints = {
    1: "/traffic_collisions_object/",
    2: "/homicides/",
    3: "/traffic_collisions_year/",


  }
  

  getRaster(): Observable<Graph> {
    return this.http.get<Graph>(`${this.baseUrl}`);
  }



  constructor() { }
}
