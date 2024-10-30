import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormsManagersService {
  rangeDates = signal<Date[] | undefined>(undefined);
  dateRaster = signal<Date | undefined>(undefined);
  constructor() { }
}
