import { Region, RegionId } from './Region.js';
import { ServerState } from '../ServerState.js';
import { Opaque } from 'type-fest';
import { Entity } from './Entity.js';

export type CharacterId = Opaque<number, 'CharacterId'>;
export type CharacterData = {
	id: CharacterId;
	entityType: string;
	name: string;
	region: RegionId;
};

export class Character extends Entity<CharacterId, CharacterData> {
	public name: string;
	private region: Region | RegionId;

	constructor(
		protected readonly serverState: ServerState,
		data: CharacterData
	) {
		super(serverState, data);

		this.id = data.id;
		this.name = data.name;
		this.region = data.region;
	}

	denormalize(data: CharacterData): void {
		this.id = data.id;
		this.name = data.name;
	}

	normalize(): CharacterData {
		return {
			id: this.id,
			entityType: this.entityType,
			name: this.name,
			region:
				typeof this.region === 'number'
					? this.region
					: (this.region as Region).getId(),
			// world: typeof this.world === "number" ? this.world as WorldId : (this.world as World).id,
		};
	}

	public getRegion(): Region {
		if (typeof this.region === 'number') {
			const repository = this.serverState.getRepository(Region);

			const region = repository.get(this.region as RegionId);
			if (region === null) {
				throw new Error('.... uhm.....');
			}

			this.region = region;
		}

		return this.region as Region;
	}
}
