import { Feature } from '../models/points.model';
import { Points } from '../models/points.model';

export const PointsAdapater = (points: Points): Feature[] => [
  ...points.features,
];
