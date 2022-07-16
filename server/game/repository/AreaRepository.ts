import { Area, AreaId, AreaData } from '../entity/Area.js';
import { Repository } from './Repository.js';
import { Constructor } from 'type-fest';

export class AreaRepository extends Repository<Area, AreaId, AreaData> {
	protected entity(): Constructor<Area> {
		return Area;
	}
}
