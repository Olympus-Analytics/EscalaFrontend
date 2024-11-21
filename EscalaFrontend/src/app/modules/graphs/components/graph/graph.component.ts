import { Component, effect, inject, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DataService } from '../../../../services/data.service';
import { FormsManagersService } from '../../../../services/forms-managers.service';
import { Datasets } from '@/models/graph.model';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [ChartModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css'],
})
export class GraphComponent implements OnInit {
  dataService = inject(DataService);
  formControlService = inject(FormsManagersService);

  endpoints = [
    {
      name: 'Traffic Collisions Count',
      value: '/traffic_collisions_ts_count/',
    },
    {
      name: 'Traffic Collisions Area Count',
      value: '/traffic_collisions_ts_mean/',
    },
    {
      name: 'Tree Plot Count',
      value: '/tree_plot_count/',
    },
    {
      name: 'Tree Plot Area Count',
      value: '/tree_plot_area_count/',
    },
    { name: 'NDVI', value: '/ndvi_means/' },
    {
      name: 'LST',
      value: '/landsurface_temperature_means/',
    },
  ];

  endPointMean = {
    landsurface_temperature_means: '/landsurface_temperature_mun_mean/',
    ndvi_means: '/ndvi_mun_mean/',
  };

  generalGraphTypes = [
    { name: 'Municipality', code: 'municipality' },
    {
      name: 'Locality',
      code: 'locality',
    },

    {
      name: 'Neighborhood',
      code: 'neighborhood',
    },
  ];

  generalGraphTreeTypes = [
    {
      name: 'Year',
      code: 'YY',
    },
    {
      name: 'Month',
      code: 'MM',
    },
    {
      name: 'Locality',
      code: 'locality',
    },
    {
      name: 'Neighborhood',
      code: 'neighborhood',
    },
  ];
  TimeGraphTypes = [
    {
      name: 'Year',
      code: 'YY',
    },
    {
      name: 'Month',
      code: 'MM',
    },
  ];

  areaGraphTypes = [
    {
      name: 'Locality',
      code: 'locality',
    },
    {
      name: 'Neighborhood',
      code: 'neighborhood',
    },
  ];
  meanEndpoint = this.endPointMean.landsurface_temperature_means;
  graphsTypes = this.generalGraphTypes;
  selectedEndpoint = this.endpoints[0].value;
  selectedGraphType = this.generalGraphTypes[0].code;
  selectedTimeGraphType = this.TimeGraphTypes[0].code;
  isTree = false;
  types: string[] = ['bar'];
  typeSelected: any = this.types[0];
  data: any;
  basicOptions: any;
  mean: number = 0;
  standardDeviation: number = 0;
  onEndpointChange(selectedValue: string) {
    this.selectedEndpoint = selectedValue;
    if (this.selectedEndpoint.includes('tree')) {
      this.isTree = true;
      this.graphsTypes = this.generalGraphTreeTypes;
      this.selectedGraphType = this.generalGraphTreeTypes[0].code;
    } else {
      this.isTree = false;
      this.graphsTypes = this.generalGraphTypes;
      this.selectedGraphType = this.generalGraphTypes[0].code;
    }
    if (this.selectedEndpoint.includes('area')) {
      this.graphsTypes = this.areaGraphTypes;
      this.selectedGraphType = this.areaGraphTypes[0].code;
    } else {
      this.graphsTypes = this.generalGraphTypes;
      this.selectedGraphType = this.generalGraphTypes[0].code;
    }
    if (this.selectedEndpoint === '/landsurface_temperature_means/') {
      this.meanEndpoint = this.endPointMean.landsurface_temperature_means;
    } else if (this.selectedEndpoint === '/ndvi_means/') {
      this.meanEndpoint = this.endPointMean.ndvi_means;
    }

    this.updateGraph();
  }

  onSelectionChange(selectedValue: string) {
    this.selectedGraphType = selectedValue;
    this.updateGraph();
  }
  onSelectionTimeChange(selectedValue: string) {
    this.selectedTimeGraphType = selectedValue;
    this.updateGraph();
  }
  onSelectionChangeType(selectedValue: string) {
    this.typeSelected = selectedValue;
    this.updateGraph();
  }

  updateGraph(
    rangeDates: Date[] | undefined = this.formControlService.rangeDates(),
  ) {
    const dates: [number, number] | undefined = rangeDates?.map((date) =>
      date.getFullYear(),
    ) as [number, number] | undefined;
    this.dataService
      .getGraphDataG(
        this.meanEndpoint,
        this.selectedGraphType,
        this.selectedTimeGraphType,
        dates,
      )
      .subscribe((data) => {
        this.mean = (data.datasets as Datasets).data[0];
        this.standardDeviation = (data.datasets as Datasets).data[1];
      });

    if (!this.isTree) {
      this.dataService
        .getGraphDataG(
          this.selectedEndpoint,
          this.selectedGraphType,
          this.selectedTimeGraphType,
          dates,
        )
        .subscribe((data) => {
          this.data = {
            labels: data.labels,
            datasets: data.datasets,
          };
          this.types = data.chart;
          if (!this.types.includes(this.typeSelected)) {
            this.typeSelected = this.types[0];
          }
          this.configureChartOptions(); // Llama a la configuración de los ejes
        });
    } else {
      this.dataService
        .getGraphData(this.selectedEndpoint, this.selectedGraphType, dates)
        .subscribe((data) => {
          this.data = {
            labels: data.labels,
            datasets: [data.datasets],
          };

          this.types = data.chart;
          if (!this.types.includes(this.typeSelected)) {
            this.typeSelected = this.types[0];
          }
          this.configureChartOptions(); // Llama a la configuración de los ejes
        });
    }
  }

  configureChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary',
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    const displayAxes = this.typeSelected !== 'pie';

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
            color: displayAxes ? textColorSecondary : 'transparent',
          },
          grid: {
            color: displayAxes ? surfaceBorder : 'transparent',
            drawBorder: displayAxes,
          },
        },
        x: {
          ticks: {
            color: displayAxes ? textColorSecondary : 'transparent',
          },
          grid: {
            color: displayAxes ? surfaceBorder : 'transparent',
            drawBorder: displayAxes,
          },
        },
      },
    };
  }

  constructor() {
    effect(() => {
      this.updateGraph(this.formControlService.rangeDates());
    });
  }

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary',
    );
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
