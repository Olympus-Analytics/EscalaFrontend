import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatesService {
  private loadingStateSubject = new BehaviorSubject<boolean>(false);
  loadingState$: Observable<boolean> = this.loadingStateSubject.asObservable();

  constructor() { }

  setLoadingState(isLoading: boolean): void {
    this.loadingStateSubject.next(isLoading);
  }
}
