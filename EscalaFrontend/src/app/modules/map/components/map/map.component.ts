import { Component, effect, inject, OnInit } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { Raster } from '../../../../models/raster.model';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { latLng, tileLayer, imageOverlay, Layer, latLngBounds, LatLngTuple  } from 'leaflet';
import { getCoordinatesFromAuxXml } from '../../../../utils/GetCoordinateFromXML.utils';
import { FormsManagersService } from '../../../../services/forms-managers.service';

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
  raster: HTMLImageElement | undefined;
  layers: Layer[] = [];

  constructor() {
    effect(() => {
      this.updateRaster(this.formControlService.dateRaster());
    })
  }

  // Opciones iniciales del mapa
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 12,
    center: latLng(10.9685,-74.7813),
    zoomControl: false
  };

  updateRaster(time: Date | undefined = undefined): void {
    const year = time?.getFullYear() || 2000;
    this.dataService.getRaster(year).subscribe((raster: Raster) => {
   
      this.dataService.GetImage(raster.RASTER_URL).subscribe((image: Blob) => {
        const url = URL.createObjectURL(image);
        const img = new Image();

        img.src = url;
        this.raster = img;
        img.onload = () => {
          console.log('Image loaded:', img.width, img.height);

        
          this.dataService.GetXML(raster.RASTER_AUX).subscribe((xml: string) => {

            getCoordinatesFromAuxXml(xml, img.width, img.height).then((coordinates) => {
              console.log('Coordinates:', coordinates);

           
              const topLeft: LatLngTuple = [coordinates.topLeft[0], coordinates.topLeft[1]];
              const bottomRight: LatLngTuple = [coordinates.bottomRight[0], coordinates.bottomRight[1]];

             
              const bounds = latLngBounds(topLeft, bottomRight);
              const imageLayer = imageOverlay(url, bounds);

              
              this.layers = [...this.options.layers, imageLayer];
            });
          });
        };
      });
    });
  }
  ngOnInit(): void {
    this.updateRaster();
  }
}
