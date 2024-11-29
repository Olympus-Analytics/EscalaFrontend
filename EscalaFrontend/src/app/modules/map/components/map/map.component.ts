import { Component, effect, inject, OnInit } from '@angular/core';
import {
  DataService,
  PointsEndpoint,
  RasterType,
  ShapeType,
} from '../../../../services/data.service';
import { Raster } from '../../../../models/raster.model';
import { LeafletModule } from '@bluehalo/ngx-leaflet';
import {
  latLng,
  tileLayer,
  imageOverlay,
  Layer,
  latLngBounds,
  LatLngTuple,
  circleMarker,
  Canvas,
  geoJSON,
} from 'leaflet';
import { getCoordinatesFromAuxXml } from '../../../../utils/GetCoordinateFromXML.utils';
import { GeoJsonObject } from 'geojson';
import { FormsManagersService } from '../../../../services/forms-managers.service';
import { StatesService } from '../../../../services/states.service';
import { Feature } from '@/models/points.model';
import { ShapeFile } from '@/models/shapefile.model';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  dataService = inject(DataService);
  formControlService = inject(FormsManagersService);
  layerManager = Object.fromEntries(
    this.formControlService.layersActivated.map((layer) => [
      layer.name,
      layer.signal,
    ]),
  );
  rasterLayers: { [key: string]: Layer } = {};
  pointLayers: Layer[] = [];
  layers: Layer[] = [];
  geoLayer: Layer[] = [];
  stateManager = inject(StatesService);
  imageLegend: string = '';

  constructor() {
    effect(() => {
      if (this.layerManager['Ndvi Raster']()) {
        this.updateRaster(
          this.formControlService.dateRaster(),
          RasterType.NDVI,
          'Ndvi Raster',
        );
      } else {
        this.removeRasterLayer('Ndvi Raster');
      }
    });

    effect(() => {
      if (this.layerManager['Locality']()) {
        this.dataService
          .getShapeFile(ShapeType.locality_bar)
          .subscribe((shapeFile: ShapeFile) => {
            console.log('ShapeFile Data:', shapeFile);

            // Convertir en una capa geoJSON
            const geoJsonLayer = geoJSON(shapeFile as GeoJsonObject, {
              style: {
                color: 'blue',
                weight: 2,
                opacity: 0.8,
              },
              onEachFeature: (feature, layer) => {
                if (feature.properties && feature.properties.name) {
                  layer.bindPopup(`Name: ${feature.properties.name}`);
                }
              },
            });

            this.geoLayer.push(geoJsonLayer);
            this.updateLayers();
            console.log('Layers:', this.layers);
          });
      } else {
        this.removeGeoLayer();
      }
    });
    effect(() => {
      if (this.layerManager['Neighborhood']()) {
        this.dataService
          .getShapeFile(ShapeType.NEIGHBORHOOD)
          .subscribe((shapeFile: ShapeFile) => {
            console.log('ShapeFile Data:', shapeFile);

            // Convertir en una capa geoJSON
            const geoJsonLayer = geoJSON(shapeFile as GeoJsonObject, {
              style: {
                color: 'red',
                weight: 2,
                opacity: 0.8,
              },
              onEachFeature: (feature, layer) => {
                if (feature.properties && feature.properties.name) {
                  layer.bindPopup(`Name: ${feature.properties.name}`);
                }
              },
            });

            this.geoLayer.push(geoJsonLayer);
            this.updateLayers();
            console.log('Layers:', this.layers);
          });
      } else {
        this.removeGeoLayer();
      }
    });
    effect(() => {
      if (this.layerManager['Municipality']()) {
        this.dataService
          .getShapeFile(ShapeType.MUNICIPALITY)
          .subscribe((shapeFile: ShapeFile) => {
            console.log('ShapeFile Data:', shapeFile);

            // Convertir en una capa geoJSON
            const geoJsonLayer = geoJSON(shapeFile as GeoJsonObject, {
              style: {
                color: 'green',
                weight: 2,
                opacity: 0.8,
              },
              onEachFeature: (feature, layer) => {
                if (feature.properties && feature.properties.name) {
                  layer.bindPopup(`Name: ${feature.properties.name}`);
                }
              },
            });

            this.geoLayer.push(geoJsonLayer);
            this.updateLayers();
            console.log('Layers:', this.layers);
          });
      } else {
        this.removeGeoLayer();
      }
    });

    effect(() => {
      if (this.layerManager['Tree Points']()) {
        this.dataService
          .getPoint(PointsEndpoint.TREE_PLOT)
          .subscribe((points: Feature[]) => {
            this.addPointsToMap(points, 'tree');
          });
      } else {
        this.removePointLayers();
      }
    });

    effect(() => {
      if (this.layerManager['Collision Points']()) {
        this.dataService
          .getPoint(PointsEndpoint.TRAFFIC_COLLISIONS)
          .subscribe((points: Feature[]) => {
            this.addPointsToMap(points, 'collision');
          });
      } else {
        this.removePointLayers();
      }
    });

    effect(() => {
      if (this.layerManager['LST Raster']()) {
        this.updateRaster(
          this.formControlService.dateRaster(),
          RasterType.TEMPERATURE,
          'LST Raster',
        );
      } else {
        this.removeRasterLayer('LST Raster');
      }
    });
  }

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 12,
    center: latLng(10.9685, -74.7813),
    zoomControl: false,
  };

  updateRaster(
    time: Date | undefined = undefined,
    rasterType: RasterType,
    layerKey: string,
  ): void {
    const year = time?.getFullYear() || 2000;

    this.dataService.getRaster(year, rasterType).subscribe((raster: Raster) => {
      this.imageLegend = raster.RASTER_LEGEND;
      this.dataService.GetImage(raster.RASTER_URL).subscribe((image: Blob) => {
        const url = URL.createObjectURL(image);
        const img = new Image();

        img.src = url;
        img.onload = () => {
          console.log('Image loaded:', img.width, img.height);

          this.dataService
            .GetXML(raster.RASTER_AUX)
            .subscribe((xml: string) => {
              getCoordinatesFromAuxXml(xml, img.width, img.height).then(
                (coordinates) => {
                  console.log('Coordinates:', coordinates);

                  const topLeft: LatLngTuple = [
                    coordinates.topLeft[0],
                    coordinates.topLeft[1],
                  ];
                  const bottomRight: LatLngTuple = [
                    coordinates.bottomRight[0],
                    coordinates.bottomRight[1],
                  ];

                  const bounds = latLngBounds(topLeft, bottomRight);
                  const imageLayer = imageOverlay(url, bounds);

                  // Actualiza la capa del raster
                  this.rasterLayers[layerKey] = imageLayer;
                  this.updateLayers();
                },
              );
            });
        };
      });
    });
  }

  removeRasterLayer(layerKey: string): void {
    delete this.rasterLayers[layerKey];
    this.updateLayers();
  }

  addPointsToMap(points: Feature[], pointType: string): void {
    this.removePointLayers();
    const canvasRenderer = new Canvas();
    const pointColor = pointType === 'tree' ? '#008000' : '#660000'; // Verde para puntos de árboles, rojo oscuro para colisiones

    points.forEach((point) => {
      if (point.geometry && point.geometry.coordinates.length >= 2) {
        const pointMarker = circleMarker(
          [point.geometry.coordinates[1], point.geometry.coordinates[0]],
          {
            radius: 5,
            color: pointColor,
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
            renderer: canvasRenderer,
          },
        );
        this.pointLayers.push(pointMarker);
      }
    });
    this.updateLayers();
  }

  removePointLayers(): void {
    this.pointLayers = [];
    this.updateLayers();
  }

  removeGeoLayer(): void {
    this.geoLayer = [];
    this.updateLayers();
  }

  updateLayers(): void {
    this.layers = [
      ...this.options.layers,
      ...Object.values(this.rasterLayers),
      ...this.pointLayers,
      ...this.geoLayer,
    ];
  }

  ngOnInit(): void {}
}
