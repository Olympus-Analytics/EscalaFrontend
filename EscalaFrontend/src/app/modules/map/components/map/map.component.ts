import { AfterViewInit, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import RasterInfo from "@arcgis/core/layers/support/RasterInfo.js";
import { DataService } from '../../../../services/data.service';
import { defineCustomElements } from "@arcgis/map-components/dist/loader";
import { Raster } from '../../../../models/raster.model';
import { ComponentLibraryModule } from '@arcgis/map-components-angular';
import Map from "@arcgis/core/Map";
import View from "@arcgis/core/views/View";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [ComponentLibraryModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  dataService = inject(DataService);
  rasterInfo: Blob | undefined;
  rasterSubscription: Subscription | undefined;
  rasterDataSubscription: Subscription | undefined;

  constructor() { }

  ngOnInit() {
    // Obtener la información del raster y suscribirse a los datos
    this.rasterSubscription = this.dataService.getRaster().subscribe((rasterInfo: Raster) => {
      this.rasterDataSubscription = this.dataService.Get(rasterInfo.RASTER_URL).subscribe((data: Blob) => {
        this.rasterInfo = data;
        console.log(this.rasterInfo);
      });
    });

    // Cargar elementos personalizados de ArcGIS
    defineCustomElements(window, { resourcesUrl: "https://js.arcgis.com/map-components/4.30/assets" });
  }

  arcgisViewReadyChange(event: any) {
    const map: Map = event.target.map;
    const view: View = event.target.view;
    // Aquí puedes agregar más lógica para interactuar con el mapa y la vista
  }

  ngAfterViewInit() {
    // Lógica que se ejecuta después de que la vista haya sido completamente inicializada
  }

  ngOnDestroy() {
    // Desuscribirse de las suscripciones para evitar fugas de memoria
    this.rasterSubscription?.unsubscribe();
    this.rasterDataSubscription?.unsubscribe();
  }
}
