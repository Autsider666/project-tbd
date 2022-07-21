import { Opaque } from 'type-fest';
import { Client } from '../controller/ClientController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { ServerState } from '../ServerState.js';
import { Region, RegionId } from './Region.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';

export type BorderId = Opaque<Uuid, 'BorderId'>;
export type BorderStateData = {
	regions: RegionId[];
	type: BorderType;
} & EntityStateData<BorderId>;

export type BorderClientData = BorderStateData & EntityClientData<BorderId>;

export enum BorderType {
	default = 'default',
}

export class Border extends Entity<BorderId, BorderStateData> {
	regions = new Map<RegionId, Region | null>();
	type: BorderType;

	constructor(
		protected readonly serverState: ServerState,
		data: BorderStateData
	) {
		super(serverState, data);

		this.id = data.id;
		this.type = data.type ?? BorderType.default;

		data.regions.forEach((id) => this.regions.set(id, null));
	}

	toJSON(): BorderStateData {
		return {
			id: this.id,
			type: this.type,
			regions: Array.from(this.regions.keys()),
		};
	}

	public override normalize(forClient?: Client | null): BorderClientData {
		return {
			entityType: this.getEntityType(),
			...this.toJSON(),
		};
	}
}
