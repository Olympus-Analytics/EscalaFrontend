import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./modules/map/components/map/map.component')
      .then((m) => m.MapComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./modules/Views/dashboard/dashboard.component')
      .then((m) => m.DashboardComponent),
  }
];
