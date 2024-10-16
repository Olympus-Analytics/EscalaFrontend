import { AfterViewInit, Component, inject, OnInit, OnDestroy } from '@angular/core';

import { DataService } from '../../../../services/data.service';



import { Raster } from '../../../../models/raster.model';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {


  constructor() {}

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  ngOnDestroy() {

  }

 
  private async updateGeoTIFFLayer() {

  }



  private addMarkers() {

  }

  private centerMap() {

  }
}
