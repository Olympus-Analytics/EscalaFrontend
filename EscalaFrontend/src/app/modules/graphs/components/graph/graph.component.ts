import { Component, inject, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [ChartModule, MatFormFieldModule, MatSelectModule],
  template: `
  <div class="card md:w-[35rem] w-96 shadow-2xl rounded-2xl flex flex-col py-3 gap-6 px-14 app-graph">
    <p-chart
      [type]="typeSelected"
      [data]="data"
      [options]="basicOptions"
      height="300"
      width="300"
    ></p-chart>
    <div class="flex flex-row justify-between gap-10">
      <mat-form-field>
        <mat-label>Selecciona la categoría</mat-label>
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
        <mat-label>Selecciona un filtro</mat-label>
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
        <mat-label>Selecciona un tipo de gráfica</mat-label>
        <mat-select
          [(value)]="typeSelected"
          (selectionChange)="onSelectionChangeType($event.value)"
        >
          @for ( item of types; track item) {
            <mat-option [value]="item">{{ item }}</mat-option>
          }
        </mat-select>
      </mat-form-field>
    </div>
  </div>
  `,
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit {
  dataService = inject(DataService);

  // Endpoints disponibles
  endpoints = [
    { name: 'Traffic Collisions Count', value: '/traffic_collisions_count/' },
    { name: 'Traffic Collisions Area Count', value: '/traffic_collisions_area_count/' },
    { name: 'Tree Plot Count', value: '/tree_plot_count/' },
    { name: 'Tree Plot Area Count', value: '/tree_plot_area_count/' },
  ];

  // Tipos de gráficos para los endpoints normales
  generalGraphTypes = [
    { name: 'Object', code: 'object' },
    { name: 'Type', code: 'object_type' },
    { name: 'Zone', code: 'zone' },
    { name: 'Year', code: 'YY' },
    { name: 'Area', code: 'area' },
    { name: 'neighborhood', code: 'neighborhood' },
    { name: 'Severity', code: 'severity' },
    { name: 'Month', code: 'MM' },
    { name: 'Day', code: 'DD' },
    { name: 'Municipality', code: 'municipality' },
    { name: 'Locality', code: 'locality' },
  ];

  // Tipos de gráficos para los endpoints con "area"
  areaGraphTypes = [
    { name: 'Municipality', code: 'municipality' },
    { name: 'Locality', code: 'locality' },
    { name: 'neighborhood', code: 'neighborhood' },
  ];

  graphsTypes = this.generalGraphTypes; // Inicialmente, muestra los tipos generales
  selectedEndpoint = this.endpoints[0].value;
  selectedGraphType = this.generalGraphTypes[0].code; // El primer tipo de gráfica
  types: string[] = ['bar'];
  typeSelected: any = this.types[0];
  data: any;
  basicOptions: any;

  // Cuando el usuario cambia el endpoint seleccionado
  onEndpointChange(selectedValue: string) {
    this.selectedEndpoint = selectedValue;

    // Cambia los tipos de gráficos dependiendo si el endpoint contiene "area"
    if (this.selectedEndpoint.includes('area')) {
      this.graphsTypes = this.areaGraphTypes;
      this.selectedGraphType = this.areaGraphTypes[0].code; // Selecciona el primer filtro para "area"
    } else {
      this.graphsTypes = this.generalGraphTypes;
      this.selectedGraphType = this.generalGraphTypes[0].code; // Selecciona el primer filtro general
    }

    this.updateGraph();
  }

  // Cuando el usuario cambia el filtro del gráfico
  onSelectionChange(selectedValue: string) {
    this.selectedGraphType = selectedValue;
    this.updateGraph();
  }

  // Cuando el usuario cambia el tipo de gráfico
  onSelectionChangeType(selectedValue: string) {
    this.typeSelected = selectedValue;
    this.updateGraph();
  }

  // Actualizar el gráfico en función del endpoint y el filtro seleccionados
  updateGraph() {
    this.dataService.getGraphData(this.selectedEndpoint, this.selectedGraphType).subscribe((data) => {
      this.data = {
        labels: data.labels,
        datasets: [data.datasets],
      };
      this.types = data.chart;
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
