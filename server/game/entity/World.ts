import { ServerState } from '../../ServerState.js';
import { Area, AreaId } from './Area.js';
import { Opaque } from 'type-fest';
import { Entity } from './Entity.js';

export type WorldId = Opaque<number, 'WorldId'>;

export type WorldData = {
	id: WorldId;
	name: string;
	areas: AreaId[];
};

export class World extends Entity<WorldId, WorldData> {
	public id: WorldId;
	public name: string;
	private areas = new Map<AreaId, Area | null>();

	constructor(protected readonly serverState: ServerState, data: WorldData) {
		super(serverState, data);

		this.id = data.id;
		this.name = data.name;
		data.areas.forEach((id) => this.areas.set(id, null));
	}

	denormalize(data: WorldData): void {
		this.id = data.id;
		this.name = data.name;
	}

	normalize(): WorldData {
		return {
			id: this.id,
			name: this.name,
			areas: Array.from(this.areas.keys()),
		};
	}
}
