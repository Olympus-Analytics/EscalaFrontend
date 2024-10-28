import { Component, inject, OnInit } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { Raster } from '../../../../models/raster.model';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import { latLng, tileLayer, imageOverlay, Layer, latLngBounds, LatLngTuple  } from 'leaflet';
import { getCoordinatesFromAuxXml } from '../../../../utils/GetCoordinateFromXML.utils';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  dataService = inject(DataService);
  raster: HTMLImageElement | undefined;
  layers: Layer[] = [];

  // Opciones iniciales del mapa
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 12,
    center: latLng(10.9685,-74.7813)
  };

  ngOnInit(): void {
    this.dataService.getRaster().subscribe((raster: Raster) => {
      // Obtener la imagen del servicio
      this.dataService.GetImage(raster.RASTER_URL).subscribe((image: Blob) => {
        const url = URL.createObjectURL(image);
        const img = new Image();

        img.src = url;
        this.raster = img;
        img.onload = () => {
          console.log('Image loaded:', img.width, img.height);

          // Obtener el archivo XML y calcular las coordenadas
          this.dataService.GetXML(raster.RASTER_AUX).subscribe((xml: string) => {

            getCoordinatesFromAuxXml(xml, img.width, img.height).then((coordinates) => {
              console.log('Coordinates:', coordinates);

              // Convertir las coordenadas a LatLngTuple si es necesario
              const topLeft: LatLngTuple = [coordinates.topLeft[0], coordinates.topLeft[1]];
              const bottomRight: LatLngTuple = [coordinates.bottomRight[0], coordinates.bottomRight[1]];

              // Crear los límites de la capa de imagen
              const bounds = latLngBounds(topLeft, bottomRight);
              const imageLayer = imageOverlay(url, bounds);

              // Añadir la capa de imagen a las capas del mapa
              this.layers = [...this.options.layers, imageLayer];
            });
          });
        };
      });
    });
  }
}
