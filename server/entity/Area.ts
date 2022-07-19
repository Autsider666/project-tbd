import { Border, BorderId } from './Border.js';
import { World, WorldId } from './World.js';
import { ServerState } from '../ServerState.js';
import { Entity } from './Entity.js';
import { Character, CharacterId } from './Character.js';
import { Opaque } from 'type-fest';

export type AreaId = Opaque<number, 'AreaId'>;
export type AreaData = {
	id: AreaId;
	name: string;
	characters: CharacterId[];
	borders: BorderId[];
	world: WorldId;
	type: AreaType;
};

export enum AreaType {
	plain = 'plain',
}

export class Area extends Entity<AreaId, AreaData> {
	id: AreaId;
	name: string;
	characters = new Map<CharacterId, Character | null>();
	borders = new Map<BorderId, Border | null>();
	world: World | WorldId;
	type: AreaType;

	constructor(protected readonly serverState: ServerState, data: AreaData) {
		super(serverState, data);

		this.id = data.id;
		this.name = data.name;
		this.world = data.world;
		this.type = data.type ?? AreaType.plain;

		data.characters.forEach((id) => this.characters.set(id, null));
		data.borders.forEach((id) => this.borders.set(id, null));
	}

	denormalize(data: AreaData): void {
		this.id = data.id;
		this.name = data.name;
		this.type = data.type;

		this.characters.clear();
		this.borders.clear();

		data.characters.forEach((id) => this.characters.set(id, null));
		data.borders.forEach((id) => this.borders.set(id, null));
	}

	normalize(): AreaData {
		return {
			id: this.id,
			name: this.name,
			type: this.type,
			characters: Array.from(this.characters.keys()),
			borders: Array.from(this.borders.keys()),
			world:
				typeof this.world === 'number'
					? (this.world as WorldId)
					: (this.world as World).id,
		};
	}
}
