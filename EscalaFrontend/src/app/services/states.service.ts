import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatesService {
  loadingState = signal(false);
  constructor() { }
}
