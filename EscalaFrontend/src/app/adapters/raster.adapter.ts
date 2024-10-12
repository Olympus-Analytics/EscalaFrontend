import { Raster, Result } from '../models/raster.model';
import { routes } from '../app.routes';

export const RasterAdapter = (raster:Raster):Result[] => ([...raster.results])
