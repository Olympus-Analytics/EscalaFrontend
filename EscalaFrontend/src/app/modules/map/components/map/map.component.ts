import { AfterViewInit, Component, inject, OnInit, OnDestroy } from '@angular/core';

import RasterInfo from "@arcgis/core/layers/support/RasterInfo.js";
import { DataService } from '../../../../services/data.service';
import { defineCustomElements } from "@arcgis/map-components/dist/loader";
import { Raster } from '../../../../models/raster.model';
import { ComponentLibraryModule } from '@arcgis/map-components-angular';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [ComponentLibraryModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {


  constructor() { }

  ngOnInit() {
    defineCustomElements(window, { resourcesUrl: "https://js.arcgis.com/map-components/4.30/assets" });
  }
  arcgisViewReadyChange(event: any) {

  }
  ngAfterViewInit() {

  }

  ngOnDestroy() {

  }

}
