import { AfterViewInit, Component, inject, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { DataService } from '../../../../services/data.service';
import { Result } from '../../../../models/raster.model';
import GeoRasterLayer from 'georaster-layer-for-leaflet';
import * as GeoTIFF from 'geotiff';

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
  markers: L.Marker[] = [
    L.marker([10.9639, -74.7960]),
    L.marker([10.96, -74.7960]),
  ];
  image: any;

  constructor() {}

  ngOnInit() {
    this.dataService.getRaster().subscribe({
      next: (data: Result[]) => {
        this.rasterUrl = data[0].RASTER_URL;
        console.log('GeoTIFF URL:', this.rasterUrl);
        this.fetchGeoTIFF(this.rasterUrl);
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

  private async fetchGeoTIFF(url: string) {
    try {
      const response = await this.dataService.Get(url).toPromise();
      this.image = response;
      await this.addGeoTIFFLayer();
    } catch (error) {
      console.error('Error fetching GeoTIFF:', error);
    }
  }

  private async addGeoTIFFLayer() {
    if (this.image) {
      try {
        const arrayBuffer = await this.image.arrayBuffer();
        const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
        const image = await tiff.getImage();
        const georaster = await image.readRasters();

        const layer = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.7,
          resolution: 256,
        });

        layer.addTo(this.map);
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
