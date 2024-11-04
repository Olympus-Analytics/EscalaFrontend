import { Component, effect, inject, OnInit } from '@angular/core';
import { DataService, RasterType } from '../../../../services/data.service';
import { Raster } from '../../../../models/raster.model';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { latLng, tileLayer, imageOverlay, Layer, latLngBounds, LatLngTuple } from 'leaflet';
import { getCoordinatesFromAuxXml } from '../../../../utils/GetCoordinateFromXML.utils';
import { FormsManagersService } from '../../../../services/forms-managers.service';
import { StatesService } from '../../../../services/states.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  dataService = inject(DataService);
  formControlService = inject(FormsManagersService);
  layerManager = Object.fromEntries(
    this.formControlService.layersActivated.map(layer => [layer.name, layer.signal])
  );
  rasterLayers: { [key: string]: Layer } = {};
  layers: Layer[] = [];
  stateManager = inject(StatesService);

  constructor() {
    
    effect(() => {
      if (this.layerManager['Ndvi Raster']()) {
        this.updateRaster(this.formControlService.dateRaster(), RasterType.NDVI, 'Ndvi Raster');
      } else {
        this.removeRasterLayer('Ndvi Raster');
      }
    });

    effect(() => {
    });
    
    effect(() => {
      if (this.layerManager['LST Raster']()) {
        this.updateRaster(this.formControlService.dateRaster(), RasterType.TEMPERATURE, 'LST Raster');
      } else {
        this.removeRasterLayer('LST Raster');
      }
    });


  }

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 12,
    center: latLng(10.9685, -74.7813),
    zoomControl: false
  };

  updateRaster(time: Date | undefined = undefined, rasterType: RasterType, layerKey: string): void {
    const year = time?.getFullYear() || 2000;

    this.dataService.getRaster(year, rasterType).subscribe((raster: Raster) => {
      this.dataService.GetImage(raster.RASTER_URL).subscribe((image: Blob) => {
        const url = URL.createObjectURL(image);
        const img = new Image();

        img.src = url;
        img.onload = () => {
          console.log('Image loaded:', img.width, img.height);

          this.dataService.GetXML(raster.RASTER_AUX).subscribe((xml: string) => {
            getCoordinatesFromAuxXml(xml, img.width, img.height).then((coordinates) => {
              console.log('Coordinates:', coordinates);

              const topLeft: LatLngTuple = [coordinates.topLeft[0], coordinates.topLeft[1]];
              const bottomRight: LatLngTuple = [coordinates.bottomRight[0], coordinates.bottomRight[1]];

              const bounds = latLngBounds(topLeft, bottomRight);
              const imageLayer = imageOverlay(url, bounds);

              // Actualiza la capa del raster
              this.rasterLayers[layerKey] = imageLayer;
              this.updateLayers();
            });
          });
        };
      });
    });
  }

  removeRasterLayer(layerKey: string): void {
    delete this.rasterLayers[layerKey];
    this.updateLayers();
  }

  updateLayers(): void {
    // Combina las capas base y raster activas
    this.layers = [
      ...this.options.layers,
      ...Object.values(this.rasterLayers)
    ];
  }

  ngOnInit(): void {}
}
