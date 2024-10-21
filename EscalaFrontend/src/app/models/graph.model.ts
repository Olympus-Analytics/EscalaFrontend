
export interface Result {
  count:    number;
  next:     string;
  previous: null;
  results:  Results;
}

export interface Results {
  type:     string;
  features: Feature[];
}

export interface Feature {
  id:         number;
  type:       string;
  geometry:   Geometry;
  properties: Properties;
}

export interface Geometry {
  type:        string;
  coordinates: number[];
}

export interface Properties {
  COLYEAR:   number;
  COLMONTH:  number;
  COLDAY:    number;
  COLHOUR:   number;
  COLMIN:    number;
  COLZONE:   number;
  COLAREA:   number;
  COLVICNUM: number;
  COLSEV:    number;
  COLTYP:    number;
  COLOBJ:    number;
  COLOBJTYP: number;
  COLHYP:    string;
  COLADDR:   string;
}





export interface Graph {
  labels:      string[];
  datasets:    Datasets | Datasets[];
  description: string;
  chart:       string[];
}


export interface Datasets {
  label: string;
  data:  number[];
}




export enum RasterFilter {
  ndvi = "ndvi"
}



