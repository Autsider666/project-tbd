import { Area, AreaId } from './Area.js';
import { ServerState } from '../../ServerState.js';
import { Opaque } from 'type-fest';
import { Entity } from './Entity.js';

export type CharacterId = Opaque<number, 'CharacterId'>;
export type CharacterData = {
	id: CharacterId;
	name: string;
	area: AreaId;
};

export class Character extends Entity<CharacterId, CharacterData> {
	public id: CharacterId;
	public name: string;
	public area: Area | AreaId;

	constructor(
		protected readonly serverState: ServerState,
		data: CharacterData
	) {
		super(serverState, data);

		this.id = data.id;
		this.name = data.name;
		this.area = data.area;
	}

	denormalize(data: CharacterData): void {
		this.id = data.id;
		this.name = data.name;
	}

	normalize(): CharacterData {
		return {
			id: this.id,
			name: this.name,
			area:
				typeof this.area === 'number'
					? this.area
					: (this.area as Area).id,
			// world: typeof this.world === "number" ? this.world as WorldId : (this.world as World).id,
		};
	}
}
