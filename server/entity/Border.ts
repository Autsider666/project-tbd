import { Opaque } from 'type-fest';
import { ServerState } from '../ServerState.js';
import { Area, AreaId } from './Area.js';
import { Entity } from './Entity.js';

export type BorderId = Opaque<number, 'BorderId'>;
export type BorderData = {
	id: BorderId;
	areas: AreaId[];
	type: BorderType;
};

export enum BorderType {
	default = 'default',
}

export class Border extends Entity<BorderId, BorderData> {
	id: BorderId;
	areas = new Map<AreaId, Area | null>();
	type: BorderType;

	constructor(protected readonly serverState: ServerState, data: BorderData) {
		super(serverState, data);

		this.id = data.id;
		this.type = data.type ?? BorderType.default;

		data.areas.forEach((id) => this.areas.set(id, null));
	}

	denormalize(data: BorderData): void {
		this.id = data.id;
		this.type = data.type;

		this.areas.clear();
		data.areas.forEach((id) => this.areas.set(id, null));
	}

	normalize(): BorderData {
		return {
			id: this.id,
			type: this.type,
			areas: Array.from(this.areas.keys()),
		};
	}
}
