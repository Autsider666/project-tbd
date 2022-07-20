import { Opaque } from 'type-fest';
import { ServerState } from '../ServerState.js';
import { Region, RegionId } from './Region.js';
import { Entity } from './Entity.js';

export type BorderId = Opaque<number, 'BorderId'>;
export type BorderData = {
	id: BorderId;
	entityType: string;
	regions: RegionId[];
	type: BorderType;
};

export enum BorderType {
	default = 'default',
}

export class Border extends Entity<BorderId, BorderData> {
	regions = new Map<RegionId, Region | null>();
	type: BorderType;

	constructor(protected readonly serverState: ServerState, data: BorderData) {
		super(serverState, data);

		this.id = data.id;
		this.type = data.type ?? BorderType.default;

		data.regions.forEach((id) => this.regions.set(id, null));
	}

	denormalize(data: BorderData): void {
		this.id = data.id;
		this.type = data.type;

		this.regions.clear();
		data.regions.forEach((id) => this.regions.set(id, null));
	}

	normalize(): BorderData {
		return {
			id: this.id,
			entityType: this.entityType,
			type: this.type,
			regions: Array.from(this.regions.keys()),
		};
	}
}
