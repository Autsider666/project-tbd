import { Opaque } from 'type-fest';
import { ServerState } from '../ServerState.js';
import { Area, AreaId } from './Area.js';
import { Entity } from './Entity.js';

export type BorderId = Opaque<number, 'BorderId'>;
export type BorderData = {
	id: BorderId;
	areas: AreaId[];
};

export class Border extends Entity<BorderId, BorderData> {
	id: BorderId;
	areas = new Map<AreaId, Area | null>();

	constructor(protected readonly serverState: ServerState, data: BorderData) {
		super(serverState, data);

		this.id = data.id;
		data.areas.forEach((id) => this.areas.set(id, null));
	}

	denormalize(data: BorderData): void {
		this.id = data.id;
		this.areas.clear();
		data.areas.forEach((id) => this.areas.set(id, null));
	}

	normalize(): BorderData {
		return {
			id: this.id,
			areas: Array.from(this.areas.keys()),
		};
	}
}
