import { Component, input } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { GraphComponent } from '../../graphs/components/graph/graph.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [GraphComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  
  data = input<JSON>()
}
