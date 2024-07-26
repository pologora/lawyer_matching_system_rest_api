import { Region } from './regions.model';

export const getAllRegionsService = async () => {
  return await Region.getAll();
};
