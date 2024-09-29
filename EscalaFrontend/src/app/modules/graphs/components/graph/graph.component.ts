import { Component, inject, input, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Graph, GraphsType } from '../../../../models/graph.model';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [ChartModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.css',
})
export class GraphComponent implements OnInit {
  dataService = inject(DataService);
  graphsTypes = [
    {
      name: 'Traffic Collisions Object',
      code: GraphsType.traffic_collisions_object,
    },
    {
      name: 'Traffic Collisions Object Type',
      code: GraphsType.traffic_collisions_object_type,
    },
    {
      name: 'Traffic Collisions Area',
      code: GraphsType.traffic_collisions_area,
    },
    {
      name: 'Traffic Collisions Zone',
      code: GraphsType.traffic_collisions_zone,
    },
    {
      name: 'Traffic Collisions Victims Year',
      code: GraphsType.traffic_collisions_victims_year,
    },
    {
      name: 'Traffic Collisions Victims Month',
      code: GraphsType.traffic_collisions_victims_month,
    },
    {
      name: 'Traffic Collisions Road',
      code: GraphsType.traffic_collisions_road,
    },
    {
      name: 'Traffic Collisions Severity',
      code: GraphsType.traffic_collisions_severity,
    },
  ];

  selected = this.graphsTypes[0].code;
  types: string[] | undefined;
  typeSelected:any;
  data: any;

  basicOptions: any;
  onSelectionChange(seletedValue: GraphsType) {
    this.selected = seletedValue;

    this.updateGraph()

    console.log(this.selected);
  }
  onSelectionChangeType(seletedValue: any) {
    this.typeSelected = seletedValue;
    this.updateGraph()

  }
  updateGraph(){
    this.dataService.getRaster(this.selected).subscribe((data) => {
      console.log(data.datasets);

      this.data = {
        labels: data.labels,
        datasets: [data.datasets],
      };
      this.types = data.chart;
      this.typeSelected = this.typeSelected === undefined || !this.types.includes(this.typeSelected) ? this.types[0] : this.typeSelected;
    });

  }

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary',
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    this.updateGraph()
    this.typeSelected = this.types[0];
    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }
}
