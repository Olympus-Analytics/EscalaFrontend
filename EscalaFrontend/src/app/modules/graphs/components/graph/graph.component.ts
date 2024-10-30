import { Component, effect, inject, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DataService } from '../../../../services/data.service';
import { FormsManagersService } from '../../../../services/forms-managers.service';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [ChartModule, MatFormFieldModule, MatSelectModule],
  template: `
  <div class=" w-full h-full flex flex-col py-3 gap-6 px-14 ">
  <div class="flex flex-row justify-start items-center gap-8">
      <mat-form-field>
        <mat-label>Category</mat-label>
        <mat-select
          [(value)]="selectedEndpoint"
          (selectionChange)="onEndpointChange($event.value)"
        >
          @for (item of endpoints; track item.value) {
            <mat-option [value]="item.value">
              {{ item.name }}
            </mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Filter</mat-label>
        <mat-select
          [(value)]="selectedGraphType"
          (selectionChange)="onSelectionChange($event.value)"
        >
          @for ( item of graphsTypes; track item.code) {
            <mat-option [value]="item.code">
              {{ item.name }}
            </mat-option>
          }
        </mat-select>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Figure type</mat-label>
        <mat-select
          [(value)]="typeSelected"
          (selectionChange)="onSelectionChangeType($event.value)"
        >
          @for (item of types; track item) {
            <mat-option [value]="item">{{ item }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
      <div class=" flex flex-row  justify-between items-center gap-10">
       <div class=" bg-secondary-trans text-quaternary rounded-2xl w-24 p-2 flex flex-col items-center">
        <p>Mean</p>
        <span class=" text-4xl" >98</span>
      </div>
      <div class=" bg-secondary-trans text-quaternary rounded-2xl w-44 p-2 flex flex-col items-center ">
        <p>Standard Deviation</p>
        <span class=" text-4xl" >98</span>
      </div>
      </div>
    </div>
    <p-chart
      [type]="typeSelected"
      [data]="data"
      [options]="basicOptions"
      responsive="true"
      height="60vh"
      width="80vw"

    />

  </div>
  `,
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit {
  dataService = inject(DataService);
  formControlService = inject(FormsManagersService);

  endpoints = [
    { name: 'Traffic Collisions Count', value: '/traffic_collisions_count/' },
    { name: 'Traffic Collisions Area Count', value: '/traffic_collisions_area_count/' },
    { name: 'Tree Plot Count', value: '/tree_plot_count/' },
    { name: 'Tree Plot Area Count', value: '/tree_plot_area_count/' },
  ];

  generalGraphTypes = [

    { name: 'Year', code: 'YY' },
    { name: 'Month', code: 'MM' },
    { name: 'Locality', code: 'locality' },
    { name: 'Neighborhood', code: 'neighborhood' },

  ];

  areaGraphTypes = [
    { name: 'Locality', code: 'locality' },
    { name: 'Neighborhood', code: 'neighborhood' },
  ];

  graphsTypes = this.generalGraphTypes;
  selectedEndpoint = this.endpoints[0].value;
  selectedGraphType = this.generalGraphTypes[0].code;
  types: string[] = ['bar'];
  typeSelected: any = this.types[0];
  data: any;
  basicOptions: any;

  onEndpointChange(selectedValue: string) {
    this.selectedEndpoint = selectedValue;

    if (this.selectedEndpoint.includes('area')) {
      this.graphsTypes = this.areaGraphTypes;
      this.selectedGraphType = this.areaGraphTypes[0].code;
    } else {
      this.graphsTypes = this.generalGraphTypes;
      this.selectedGraphType = this.generalGraphTypes[0].code;
    }

    this.updateGraph();
  }


  onSelectionChange(selectedValue: string) {
    this.selectedGraphType = selectedValue;
    this.updateGraph();
  }


  onSelectionChangeType(selectedValue: string) {
    this.typeSelected = selectedValue;
    this.updateGraph();
  }

  updateGraph(rangeDates: Date[] | undefined = this.formControlService.rangeDates()) {
    const dates : [number, number] | undefined = rangeDates?.map((date) => date.getFullYear()) as [number, number] | undefined; 
    
    this.dataService.getGraphData(this.selectedEndpoint, this.selectedGraphType, dates).subscribe((data) => {
      this.data = {
        labels: data.labels,
        datasets: [data.datasets],
      };
      this.types = data.chart;
    });
  }
  constructor() {
    effect(() => {
      this.updateGraph(this.formControlService.rangeDates());
    });
  }

  ngOnInit() {
    
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.updateGraph();

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
