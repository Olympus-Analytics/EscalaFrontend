import { Injectable, Signal, signal } from '@angular/core';
interface LayersActivated {
  name: string; 
  signal: Signal<boolean>;
}

@Injectable({
  providedIn: 'root'
})
export class FormsManagersService {
  rangeDates = signal<Date[] | undefined>(undefined);
  dateRaster = signal<Date | undefined>(undefined);
  
  layersActivated: LayersActivated[] = [
    {name: 'Tree Points', signal: signal(false)},
    {name: 'Collision Points', signal: signal(false)},
    {name: 'Ndvi Raster', signal: signal(false)},
    {name: 'LST Raster', signal: signal(false)},
  ]
  constructor() { }
}
