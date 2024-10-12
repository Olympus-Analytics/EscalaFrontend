export interface Raster {
  count:    number;
  next:     null;
  previous: null;
  results:  Result[];
}

export interface Result {
  YEAR:       number;
  MONTH:      number;
  DAY:        number;
  LANDSAT:    number;
  RASTER_URL: string;
}
