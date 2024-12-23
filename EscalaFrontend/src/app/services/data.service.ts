import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { finalize, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Graph } from '../models/graph.model';
import { Raster } from '../models/raster.model';
import { StatesService } from './states.service';
import { Feature, Points } from '../models/points.model';
import { PointsAdapater } from '../adapters/points.adapter';
import { ShapeFile } from '@/models/shapefile.model';
import { Router } from '@angular/router';
import { FormsManagersService } from './forms-managers.service';
export enum RasterType {
  NDVI = 'ndvi',
  TEMPERATURE = 'landsurface_temperature',
}
export enum PointsEndpoint {
  TRAFFIC_COLLISIONS = '/traffic_collisions_point/',
  TREE_PLOT = '/tree_plot_point/',
}
export enum ShapeType {
  locality_bar = '/locality_bar/',
  NEIGHBORHOOD = '/neightborhood/',
  MUNICIPALITY = '/municipality/',
}

export enum DownloadType {
  NDVI = '/static/NDVI_bar/Download/NDVIbar_1__mean.zip',
  LST = '/static/LST_bar/Download/LSTbar_2000__mean.zip',
}
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private readonly baseUrl = environment.apiURL + '/api/data';

  http = inject(HttpClient);
  statesService = inject(StatesService);
  formManager = inject(FormsManagersService);
  private graphFilters: { [key: string]: string[] } = {
    traffic_collisions: [
      'YY',
      'MM',
      'DD',
      'HH',
      'municipality',
      'locality',
      'neighborhood',
      'zone',
      'area',
      'severity',
      'type',
      'object',
      'object_type',
    ],
    traffic_collisions_count: [
      'YY',
      'MM',
      'DD',
      'municipality',
      'locality',
      'neighborhood',
      'zone',
      'severity',
    ],
    traffic_collisions_point: [
      'YY',
      'MM',
      'DD',
      'municipality',
      'locality',
      'neighborhood',
    ],
    tree_plot: [
      'avg_diameter',
      'avg_height',
      'basal_area',
      'canopy_area',
      'area_range',
      'canopy_volume',
    ],
    tree_plot_count: [
      'avg_diameter',
      'avg_height',
      'basal_area',
      'area_covered',
      'area_range',
    ],
    tree_plot_area_count: [
      'avg_diameter',
      'avg_height',
      'canopy_area',
      'canopy_volume',
      'basal_area',
    ],
  };

  constructor() {}

  private getFiltersForEndpoint(endpoint: string): string[] {
    const endpointKey = endpoint.replace(/^\/|\/$/g, '');
    return this.graphFilters[endpointKey] || [];
  }
  getShapeFile(shapeType: ShapeType): Observable<ShapeFile> {
    return this.http.get<ShapeFile>(`${this.baseUrl}${shapeType}`);
  }
  getGraphData(
    endpoint: string,
    filter: string,
    time: [number, number] | null | undefined = null,
    space: string[] | null = null,
  ): Observable<Graph> {
    let url = `${this.baseUrl}${endpoint}?filter=${filter}`;
    this.statesService.setLoadingState(true);

    const applicableFilters = this.getFiltersForEndpoint(endpoint);

    if (time) {
      url += `&time=(${time[0]},${time[1]})`;
    }

    if (
      space &&
      space.length > 0 &&
      applicableFilters.includes('neighborhood')
    ) {
      const spaceParam = space
        .map((neighborhood) => `"${neighborhood}"`)
        .join(',');
      url += `&space=[${spaceParam}]`;
    }

    console.log('URL:', url);
    return this.http.get<Graph>(url).pipe(
      finalize(() => {
        this.statesService.setLoadingState(false);
      }),
    );
  }

  getGraphMean(
    endpoint: string,
    spatial: string,
    temporal: string,
    time: [number, number] | null | undefined = null,
  ): Observable<Graph> {
    let filter = '';
    filter = `${spatial?.toLowerCase()}_${temporal}`;
    let url = `${this.baseUrl}${endpoint}?filter=${filter}`;

    if (time) {
      url += `&time=(${time[0]},${time[1]})`;
    }
    console.log('URL:', url);
    this.statesService.setLoadingState(true);
    return this.http.get<Graph>(url).pipe(
      finalize(() => {
        this.statesService.setLoadingState(false);
      }),
    );
  }
  getGraphDataG(
    endpoint: string,
    spatial: string,
    temporal: string,
    time: [number, number] | null | undefined = null,
  ): Observable<Graph> {
    let filter = '';
    filter = `${spatial?.toLowerCase()}_${temporal}`;
    let url = `${this.baseUrl}${endpoint}?filter=${filter}`;

    if (time) {
      url += `&time=(${time[0]},${time[1]})`;
    }
    console.log('URL:', url);
    this.statesService.setLoadingState(true);
    return this.http.get<Graph>(url).pipe(
      finalize(() => {
        this.statesService.setLoadingState(false);
      }),
    );
  }

  getRaster(
    year: number = 2000,
    raterType: RasterType = RasterType.NDVI,
  ): Observable<Raster> {
    this.statesService.setLoadingState(true);
    return this.http
      .get<Raster>(`${this.baseUrl}/${raterType}/?YY=${year}`)
      .pipe(
        finalize(() => {
          this.statesService.setLoadingState(false);
        }),
      );
  }

  GetImage(url: string): Observable<Blob> {
    this.statesService.setLoadingState(true);
    return this.http
      .get(url, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      })
      .pipe(
        finalize(() => {
          this.statesService.setLoadingState(false);
        }),
      );
  }

  GetXML(url: string): Observable<string> {
    return this.http.get(url, {
      responseType: 'text',
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
  getPoint(endpoint: PointsEndpoint): Observable<Feature[]> {
    this.statesService.setLoadingState(true);
    return this.http
      .get<Points>(`${this.baseUrl}${endpoint}`)
      .pipe(map((info) => PointsAdapater(info)))
      .pipe(
        finalize(() => {
          this.statesService.setLoadingState(false);
        }),
      );
  }

  download() {
    const treePlot = this.formManager.layerManager['Tree Points']();

    const trafficCollisions =
      this.formManager.layerManager['Collision Points']();
    const dateRaster = this.formManager.dateRaster();
    let URL = `${environment.apiURL}/api/download/?treeplot=${treePlot}&traffic_collisions=${trafficCollisions}`;

    if (!dateRaster) {
      console.error('No date selected for raster');
      return '';
    }
    if (this.formManager.layerManager['NDVI Raster']()) {
      URL += `&ndvi_year=${dateRaster.getFullYear()}`;
    }
    if (this.formManager.layerManager['LST Raster']()) {
      URL += `&lst_year=${dateRaster.getFullYear()}`;
    }
    const year = dateRaster.getFullYear();
    console.log('Selected year:', year);

    return URL;
  }
}
