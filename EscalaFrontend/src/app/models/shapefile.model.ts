import { GeoJsonObject, FeatureCollection, Feature, Geometry } from 'geojson';

export interface ShapeFile extends FeatureCollection {
  type: 'FeatureCollection';
  features: Feature[];
}

export interface Properties {
  NAME: string;
}
