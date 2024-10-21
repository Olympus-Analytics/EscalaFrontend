import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Graph } from '../models/graph.model';
import { Raster } from '../models/raster.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly baseUrl = environment.apiURL + '/api/data';

  http = inject(HttpClient);


  private graphFilters: { [key: string]: string[] } = {
    traffic_collisions: ['years', 'months', 'days', 'hours', 'municipality', 'locality', 'neighborhood', 'zone', 'area', 'severity', 'type', 'object', 'object_type'],
    traffic_collisions_count: ['years', 'months', 'days', 'municipality', 'locality', 'neighborhood', 'zone', 'severity'],
    traffic_collisions_point: ['years', 'months', 'days', 'municipality', 'locality', 'neighborhood'],
    tree_plot: ['avg_diameter', 'avg_height', 'basal_area', 'canopy_area', 'area_range', 'canopy_volume'],
    tree_plot_count: ['avg_diameter', 'avg_height', 'basal_area', 'area_covered', 'area_range'],
    tree_plot_area_count: ['avg_diameter', 'avg_height', 'canopy_area', 'canopy_volume', 'basal_area'],
  };

  constructor() {}

  // Método que retorna los filtros específicos para el endpoint con el tipo de retorno definido
  private getFiltersForEndpoint(endpoint: string): string[] {
    const endpointKey = endpoint.replace(/^\/|\/$/g, ''); // Eliminar las barras iniciales y finales
    return this.graphFilters[endpointKey] || [];
  }

  // Método genérico para obtener datos con filtros específicos
  getGraphData(
    endpoint: string,
    filter: string,
    time: { start: number; end: number } | null = null,
    space: string[] | null = null
  ): Observable<Graph> {
    let url = `${this.baseUrl}${endpoint}?filter=${filter}`;

    // Obtener los filtros que aplican para este endpoint
    const applicableFilters = this.getFiltersForEndpoint(endpoint);

    // Agregar el tiempo si aplica para el endpoint
    if (time && applicableFilters.includes('years')) {
      url += `&time=${time.start},${time.end}`;
    }

    // Agregar espacio (vecindarios) si está presente y si el endpoint admite 'neighborhood'
    if (space && space.length > 0 && applicableFilters.includes('neighborhood')) {
      const spaceParam = space.map((neighborhood) => `"${neighborhood}"`).join(',');
      url += `&space=[${spaceParam}]`;
    }

    console.log('URL:', url);
    return this.http.get<Graph>(url);
  }

  // Ejemplo para obtener rasters
  getRaster(year: number = 2000): Observable<Raster> {
    return this.http.get<Raster>(`${this.baseUrl}/ndvi?YY=${year}`);
  }

  Get(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });
  }
}

