import { Component, inject, OnInit } from '@angular/core';

import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AsideBarComponent } from './modules/Views/aside-bar/aside-bar.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';
import { LoadingComponent } from './modules/ui/loading/loading.component';
import { StatesService } from './services/states.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, AsideBarComponent, SelectButtonModule, FormsModule, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  statesManager = inject(StatesService);
 
  loadingState = false ;
  stateOptions: any[] = [
    { label: 'Map', value: 'map' },
    { label: 'Graphs', value: 'graph' }
  ];
  router = inject(Router);
  value: string = 'map'; 
  ngOnInit(): void {
    this.statesManager.loadingState$.subscribe((state: boolean) => {
      this.loadingState = state;
    });
  }
  constructor() {
  
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      
      if (event.url === '/') {
        this.value = 'map';
      } else if (event.url === '/dashboard') {
        this.value = 'graph';
      }
    });
  }
  onStateChange() {
    if (this.value === 'map') {
      this.router.navigate(['/']);
    } else if (this.value === 'graph') {
      this.router.navigate(['/dashboard']); 
    }
  }
}

