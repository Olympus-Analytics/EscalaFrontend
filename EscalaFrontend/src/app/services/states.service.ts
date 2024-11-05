import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatesService {
  private loadingStateSubject = new BehaviorSubject<boolean>(false);
  loadingState$: Observable<boolean> = this.loadingStateSubject.asObservable();
  disabled = signal(false);
  constructor() { }

  setLoadingState(isLoading: boolean): void {
    this.loadingStateSubject.next(isLoading);
  }
}
