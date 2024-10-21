import { AfterViewInit, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataService } from '../../../../services/data.service';

import { Raster } from '../../../../models/raster.model';


@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent  {
  dataService = inject(DataService);

}
