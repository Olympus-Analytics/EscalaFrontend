import { Component, inject, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Graph } from '../../../../models/graph.model';
import { DataService } from '../../../../services/data.service';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [ChartModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],  // Asegúrate de que es "styleUrls" en plural
})
export class GraphComponent implements OnInit {
  dataService = inject(DataService);

  // Nuevos endpoints disponibles para seleccionar
  endpoints = [
    { name: 'Traffic Collisions', value: '/traffic_collisions/' },
    { name: 'Traffic Collisions Count', value: '/traffic_collisions_count/' },
    { name: 'Traffic Collisions Point', value: '/traffic_collisions_point/' },
  ];

  // Tipos de gráficos relacionados con los endpoints
  graphsTypes = [
    { name: 'Traffic Collisions Object', code: 'object' },
    { name: 'Traffic Collisions Object Type', code: 'object_type' },
    { name: 'Traffic Collisions Area', code: 'area' },
    { name: 'Traffic Collisions Zone', code: 'zone' },
    { name: 'Traffic Collisions Victims Year', code: 'years' },
    { name: 'Traffic Collisions Victims Month', code: 'months' },
    { name: 'Traffic Collisions Road', code: 'neighborhood' },
    { name: 'Traffic Collisions Severity', code: 'severity' },
  ];

  selectedEndpoint = this.endpoints[0].value;  // El endpoint seleccionado inicialmente
  selectedGraphType = this.graphsTypes[0].code;  // El filtro seleccionado inicialmente
  types: string[] | undefined;
  typeSelected: any;
  data: any;
  basicOptions: any;

  // Cuando el usuario cambia el endpoint seleccionado
  onEndpointChange(selectedValue: string) {
    this.selectedEndpoint = selectedValue;
    this.updateGraph();  // Actualiza el gráfico con el nuevo endpoint
  }

  // Cuando el usuario cambia el filtro del gráfico
  onSelectionChange(seletedValue: string) {
    this.selectedGraphType = seletedValue;
    this.updateGraph();
  }

  // Cuando el usuario cambia el tipo de gráfico
  onSelectionChangeType(seletedValue: any) {
    this.typeSelected = seletedValue;
    this.updateGraph();
  }

  // Actualizar el gráfico en función del endpoint y el filtro seleccionados
  updateGraph() {
    this.dataService.getGraphData(this.selectedEndpoint,this.selectedGraphType, ).subscribe((data) => {
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
