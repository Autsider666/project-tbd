import { EntityUpdate } from '../controller/StateSyncController.js';
import { Border, BorderId } from './Border.js';
import { World, WorldId } from './World.js';
import { ServerState } from '../ServerState.js';
import { Entity } from './Entity.js';
import { Character, CharacterId } from './Character.js';
import { Opaque } from 'type-fest';

export type RegionId = Opaque<number, 'RegionId'>;
export type RegionData = {
	id: RegionId;
	entityType: string;
	name: string;
	characters: CharacterId[];
	borders: BorderId[];
	world: WorldId;
	type: RegionType;
};

export enum RegionType {
	plain = 'plain',
}

export class Region extends Entity<RegionId, RegionData> {
	name: string;
	characters = new Map<CharacterId, Character | null>();
	private borders = new Map<BorderId, Border | null>();
	private world: World | WorldId;
	type: RegionType;

	constructor(protected readonly serverState: ServerState, data: RegionData) {
		super(serverState, data);

		this.id = data.id;
		this.name = data.name;
		this.world = data.world;
		this.type = data.type ?? RegionType.plain;

		data.characters.forEach((id) => this.characters.set(id, null));
		data.borders.forEach((id) => this.borders.set(id, null));
	}

	denormalize(data: RegionData): void {
		this.id = data.id;
		this.name = data.name;
		this.type = data.type;

		this.characters.clear();
		this.borders.clear();

		data.characters.forEach((id) => this.characters.set(id, null));
		data.borders.forEach((id) => this.borders.set(id, null));
	}

	normalize(): RegionData {
		return {
			id: this.id,
			entityType: this.entityType,
			name: this.name,
			type: this.type,
			characters: Array.from(this.characters.keys()),
			borders: Array.from(this.borders.keys()),
			world:
				typeof this.world === 'number'
					? (this.world as WorldId)
					: (this.world as World).getId(),
		};
	}

	override prepareUpdate(updateObject: EntityUpdate = {}): EntityUpdate {
		this.getBorders().forEach(
			(border) => (updateObject = border.prepareUpdate(updateObject))
		);

		return super.prepareUpdate(updateObject);
	}

	public getWorld(): World {
		if (typeof this.world === 'number') {
			const repository = this.serverState.getRepository(World);

			const world = repository.get(this.world as WorldId);
			if (world === null) {
				throw new Error('.... uhm.....');
			}

			this.world = world;
		}

		return this.world as World;
	}

	public getBorders(): Border[] {
		this.borders.forEach((border, id) => {
			if (border !== null) {
				return;
			}

			const lazyLoadedBorder = this.serverState
				.getRepository(Border)
				.get(id);
			if (lazyLoadedBorder === null) {
				throw new Error('.... uhm.....');
			}

			this.borders.set(id, lazyLoadedBorder);
		});

		return Array.from(this.borders.values()) as Border[];
	}
}
