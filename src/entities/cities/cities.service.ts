import { City } from './cities.model';

type GetCitiesByRegionServiceProps = {
  regionId: number;
};

export const getCitiesByRegionService = async ({ regionId }: GetCitiesByRegionServiceProps) => {
  return await City.getCitiesByRegion({ regionId });
};
