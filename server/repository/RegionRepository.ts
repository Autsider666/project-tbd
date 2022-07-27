import { registry, singleton } from 'tsyringe';
import { Region, RegionId, RegionStateData } from '../entity/Region.js';
import { Repository } from './Repository.js';
import { Constructor } from 'type-fest';

@singleton()
@registry([{ token: 'Repository', useValue: RegionRepository }])
export class RegionRepository extends Repository<
	Region,
	RegionId,
	RegionStateData
> {
	protected entity(): Constructor<Region> {
		return Region;
	}
}
