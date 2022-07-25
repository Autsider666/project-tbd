import { ServerState } from '../../ServerState.js';
import { Region, RegionId } from '../Region.js';
import { MultiCommonProperty } from './MultiCommonProperty.js';

export class RegionsProperty extends MultiCommonProperty<RegionId, Region> {
	constructor(serverState: ServerState, regions: RegionId[]) {
		super(serverState, regions, Region);
	}
}
