import { Component, input, HostBinding, inject } from '@angular/core';

import { GraphComponent } from '../../graphs/components/graph/graph.component';

import {
  trigger,
  state,
  style,
  animate,
  transition,

} from '@angular/animations';

import { NgClass } from '@angular/common';
import { DashboardService } from './service/dashboard.service';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [GraphComponent, NgClass],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  animations: [
    trigger('dashboard', [
      transition(':enter', [style({transform: 'scale(0)'}), animate('280ms', style({transform: 'scale(1)'}))]),
      transition(':leave', [animate('280ms', style({transform: 'scale(0)'}))]),
    ]),
  ]
})
export class DashboardComponent {

  data = input<JSON>()
  dashboardService = inject(DashboardService)



}
