import { ServerState } from '../../ServerState.js';
import { Region, RegionId } from '../Region.js';
import { SingleCommonProperty } from './SingleCommonProperty.js';

export class RegionProperty extends SingleCommonProperty<RegionId, Region> {
	constructor(serverState: ServerState, region: RegionId | Region) {
		super(serverState, region, Region);
	}
}
