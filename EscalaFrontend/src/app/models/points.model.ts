export interface Points {
  type: string;
  features: Feature[];
}

export interface Feature {
  id: number;
  type: string;
  geometry: Geometry;
  properties: Properties;
}

export interface Geometry {
  type: string;
  coordinates: number[];
}

export interface Properties {}
