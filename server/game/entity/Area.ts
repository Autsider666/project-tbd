import { World, WorldId } from './World.js';
import { ServerState } from '../../ServerState.js';
import { Entity } from './Entity.js';
import { Character, CharacterId } from './Character.js';
import { Opaque } from 'type-fest';

export type AreaId = Opaque<number, 'AreaId'>;
export type AreaData = {
	id: AreaId;
	name: string;
	characters: CharacterId[];
	world: WorldId;
};

export class Area extends Entity<AreaId, AreaData> {
	id: AreaId;
	name: string;
	characters = new Map<CharacterId, Character | null>();
	world: World | WorldId;

	constructor(protected readonly serverState: ServerState, data: AreaData) {
		super(serverState, data);

		this.id = data.id;
		this.name = data.name;
		data.characters.forEach((id) => this.characters.set(id, null));
		this.world = data.world;
	}

	denormalize(data: AreaData): void {
		this.id = data.id;
		this.name = data.name;
	}

	normalize(): AreaData {
		return {
			id: this.id,
			name: this.name,
			characters: Array.from(this.characters.keys()),
			world:
				typeof this.world === 'number'
					? (this.world as WorldId)
					: (this.world as World).id,
		};
	}
}
