import { Component } from '@angular/core';
import { MapComponent } from '../../map/components/map/map.component';
import { AsideBarComponent } from '../aside-bar/aside-bar.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from '../dashboard/dashboard.component';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MapComponent, AsideBarComponent, SelectButtonModule, FormsModule, DashboardComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',


})
export class MainComponent {
  stateOptions: any[] = [{ label: 'Map', value: 'map' },{ label: 'Graphs', value: 'graph' }];

  value: string = 'map';
}
