export interface ShapeFile {
  type: string;
  features: Feature[];
}

export interface Feature {
  id: string;
  type: string;
  geometry: Geometry;
  properties: Properties;
}

export interface Geometry {
  type: string;
  coordinates: Array<Array<Array<number[]>>>;
}

export interface Properties {
  NAME: string;
}
