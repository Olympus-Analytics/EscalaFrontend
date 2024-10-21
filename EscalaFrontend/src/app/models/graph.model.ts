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



