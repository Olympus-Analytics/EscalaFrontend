import { Component, inject } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AsideBarComponent } from './modules/Views/aside-bar/aside-bar.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ RouterOutlet, AsideBarComponent, SelectButtonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  stateOptions: any[] = [
    { label: 'Map', value: 'map' },
    { label: 'Graphs', value: 'graph' }
  ];
  router = inject(Router);
  value: string = 'map'; // Valor por defecto

  constructor() {
    // Escuchar cambios de navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Asigna el valor dependiendo de la ruta actual
      if (event.url === '/') {
        this.value = 'map';
      } else if (event.url === '/dashboard') {
        this.value = 'graph';
      }
    });
  }
  onStateChange() {
    if (this.value === 'map') {
      this.router.navigate(['/']); // Navegar a la ruta raíz
    } else if (this.value === 'graph') {
      this.router.navigate(['/dashboard']); // Navegar a la ruta dashboard
    }
  }
}

