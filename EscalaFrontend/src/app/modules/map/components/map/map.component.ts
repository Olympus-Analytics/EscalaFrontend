import { AfterViewInit, Component, inject, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { DataService } from '../../../../services/data.service';

import GeoRasterLayer from 'georaster-layer-for-leaflet';
import * as GeoTIFF from 'geotiff';
import { Raster } from '../../../../models/raster.model';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  dataService = inject(DataService);
  rasterUrl!: string;
  private map!: L.Map;
  private geoRasterLayer!: any; // Para almacenar la capa del raster
  markers: L.Marker[] = [
    L.marker([10.9639, -74.7960]),
    L.marker([10.96, -74.7960]),
  ];
  image: any;

  constructor() {}

  ngOnInit() {
    const year = 2003; // Cambia esto por el año que necesites
    this.dataService.getRaster(year).subscribe({
      next: (data: Raster) => {
        if (data && data.RASTER_URL) { // Asegúrate de que data tenga RASTER_URL
          this.rasterUrl = data.RASTER_URL;
          console.log('GeoTIFF URL:', this.rasterUrl);
          this.fetchGeoTIFF(this.rasterUrl);
        } else {
          console.warn('No se encontraron datos raster');
        }
      },
      error: (err) => {
        console.error('Error fetching raster data:', err);
      }
    });
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  private fetchGeoTIFF(url: string) {
    try {
      this.dataService.Get(url).subscribe(data => {
        this.image = data;
      });

      this.updateGeoTIFFLayer(); // Llama a este método para actualizar el mapa
    } catch (error) {
      console.error('Error fetching GeoTIFF:', error);
    }
  }

  private async updateGeoTIFFLayer() {
    if (this.geoRasterLayer) {
      this.map.removeLayer(this.geoRasterLayer); // Elimina la capa anterior si existe
    }

    if (this.image) {
      console.log(this.image);
      try {
        const arrayBuffer = await this.image.arrayBuffer();
        const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
        const image = await tiff.getImage();
        const georaster = await image.readRasters();

        this.geoRasterLayer = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.7,
          resolution: 256,
        });

        this.geoRasterLayer.addTo(this.map); // Añade la nueva capa
      } catch (error) {
        console.error('Error processing GeoTIFF:', error);
      }
    }
  }

  private initializeMap() {
    const baseMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    this.map = L.map('map', {
      center: [10.9639, -74.7960],
      zoom: 5,
      zoomControl: true,
    });

    L.tileLayer(baseMapUrl).addTo(this.map);

    this.addMarkers();
    this.centerMap();
  }

  private addMarkers() {
    this.markers.forEach(marker => marker.addTo(this.map));
  }

  private centerMap() {
    const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));
    this.map.fitBounds(bounds, { padding: [200, 200] });
  }
}
