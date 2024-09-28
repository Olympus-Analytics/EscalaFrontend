export interface Graph {
  labels:      string[];
  datasets:    Datasets;
  description: string;
  chart:       string[];
}

export interface Datasets {
  label: string;
  data:  number[];
}
