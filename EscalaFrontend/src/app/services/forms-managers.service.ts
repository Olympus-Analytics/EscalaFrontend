import { Injectable, Signal, signal } from '@angular/core';
interface LayersActivated {
  name: string;
  signal: Signal<boolean>;
}

@Injectable({
  providedIn: 'root',
})
export class FormsManagersService {
  rangeDates = signal<Date[] | undefined>(undefined);
  dateRaster = signal<Date | undefined>(new Date(2000, 0, 1));

  layersActivated: LayersActivated[] = [
    { name: 'Tree Points', signal: signal(false) },
    { name: 'Collision Points', signal: signal(false) },
    { name: 'Ndvi Raster', signal: signal(false) },
    { name: 'LST Raster', signal: signal(false) },
    { name: 'Municipality', signal: signal(false) },
    { name: 'Locality', signal: signal(false) },
    { name: 'Neighborhood', signal: signal(false) },
  ];
  layerManager = Object.fromEntries(
    this.layersActivated.map((layer) => [layer.name, layer.signal]),
  );
  constructor() {}
}
