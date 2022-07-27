import { RegionRepository } from '../../repository/RegionRepository.js';
import { Region, RegionId } from '../Region.js';
import { SingleCommonProperty } from './SingleCommonProperty.js';

export class RegionProperty extends SingleCommonProperty<RegionId, Region> {
	constructor(region: RegionId | Region) {
		super(region, RegionRepository);
	}
}
