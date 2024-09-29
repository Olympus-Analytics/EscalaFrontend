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

export enum GraphsType {
  traffic_collisions_object = "traffic_collisions_object",
  traffic_collisions_object_type = "traffic_collisions_object_type",
  traffic_collisions_area = "traffic_collisions_area",
  traffic_collisions_zone = "traffic_collisions_zone",
  traffic_collisions_victims_year = "traffic_collisions_victims_year",
  traffic_collisions_victims_month = "traffic_collisions_victims_month",
  traffic_collisions_road = "traffic_collisions_road",
  traffic_collisions_severity = "traffic_collisions_severity"
}



