import { ServerState } from '../../ServerState.js';
import { Region, RegionId } from '../Region.js';

export class RegionProperty {
	constructor(
		protected readonly serverState: ServerState,
		protected region: RegionId | Region
	) {}

	public getRegion(): Region {
		if (typeof this.region === 'string') {
			const repository = this.serverState.getRepository(Region);

			const region = repository.get(this.region as RegionId);
			if (region === null) {
				throw new Error('.... uhm.....');
			}

			this.region = region;
		}

		return this.region as Region;
	}

	public toJSON(): RegionId {
		return typeof this.region === 'string'
			? this.region
			: (this.region as Region).getId();
	}
}
