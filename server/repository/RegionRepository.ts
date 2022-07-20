import { Region, RegionId, RegionData } from '../entity/Region.js';
import { Repository } from './Repository.js';
import { Constructor } from 'type-fest';

export class RegionRepository extends Repository<Region, RegionId, RegionData> {
	protected entity(): Constructor<Region> {
		return Region;
	}
}
