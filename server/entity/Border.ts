import { Opaque } from 'type-fest';
import { Client } from '../controller/ClientController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { ServerState } from '../ServerState.js';
import { RegionsProperty } from './CommonProperties/RegionsProperty.js';
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

export class Border extends Entity<
	BorderId,
	BorderStateData,
	BorderClientData
> {
	private regions: RegionsProperty;
	public readonly type: BorderType;

	constructor(
		protected readonly serverState: ServerState,
		data: BorderStateData
	) {
		super(serverState, data);

		this.id = data.id;
		this.type = data.type ?? BorderType.default;

		this.regions = new RegionsProperty(serverState, data.regions);
	}

	toJSON(): BorderStateData {
		return {
			id: this.id,
			type: this.type,
			regions: this.regions.toJSON(),
		};
	}

	public override normalize(forClient?: Client): BorderClientData {
		return {
			entityType: this.getEntityType(),
			...this.toJSON(),
		};
	}

	public getRegions(): Region[] {
		return this.regions.getRegions();
	}
}
