import { GraphsType, RasterFilter } from '../models/graph.model';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Graph } from '../models/graph.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly baseUrl = environment.apiURL + '/api/data';

  http = inject(HttpClient)

  endPointsGraph = {
    "traffic_collisions_object": "/traffic_collisions_object/",
    "traffic_collisions_object_type": "/traffic_collisions_object_type/",
    "traffic_collisions_area": "/traffic_collisions_area/",
    "traffic_collisions_zone": "/traffic_collisions_zone/",
    "traffic_collisions_victims_year": "/traffic_collisions_victims_year/",
    "traffic_collisions_victims_month": "/traffic_collisions_victims_month/",
    "traffic_collisions_road": "/traffic_collisions_road/",
    "traffic_collisions_severity": "/traffic_collisions_severity/",
  }
  endPointsRaster = {
    "ndvi": "/ndvi/",

  }

  getGraph(graph:GraphsType): Observable<Graph> {
    return this.http.get<Graph>(`${this.baseUrl}${this.endPointsGraph[graph]}`);
  }

  getRaste(raster:RasterFilter): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}${this.endPointsRaster[raster]}`);
  }

  constructor() { }
}
