import { Component, input ,HostBinding } from '@angular/core';

import { GraphComponent } from '../../graphs/components/graph/graph.component';

import {
  trigger,
  state,
  style,
  animate,
  transition,

} from '@angular/animations';

import { NgClass } from '@angular/common';
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
  quantity = 1;

  addQuantity = () => { if (this.quantity < 4) this.quantity++ }
  removeQuantity = () => { if(this.quantity>1) this.quantity-- }
}
