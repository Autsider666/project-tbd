import { ServerState } from '../../ServerState.js';
import { Region, RegionId } from '../Region.js';

export class RegionsProperty {
	private readonly regions = new Map<RegionId, Region | null>();

	constructor(
		protected readonly serverState: ServerState,
		regions: RegionId[]
	) {
		regions.forEach((id) => this.regions.set(id, null));
	}

	public getRegions(): Region[] {
		this.regions.forEach((region, id) => {
			if (region != null) {
				return;
			}

			const lazyLoadedRegion = this.serverState
				.getRepository(Region)
				.get(id);
			if (lazyLoadedRegion === null) {
				throw new Error('.... uhm.....');
			}

			this.regions.set(id, lazyLoadedRegion);
		});

		return Array.from(this.regions.values()) as Region[];
	}

	public toJSON(): RegionId[] {
		return Array.from(this.regions.keys());
	}
}
