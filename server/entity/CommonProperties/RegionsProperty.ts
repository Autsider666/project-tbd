import { RegionRepository } from '../../repository/RegionRepository.js';
import { Region, RegionId } from '../Region.js';
import { MultiCommonProperty } from './MultiCommonProperty.js';

export class RegionsProperty extends MultiCommonProperty<RegionId, Region> {
	constructor(regions: RegionId[]) {
		super(regions, RegionRepository);
	}
}
