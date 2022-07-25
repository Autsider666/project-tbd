import { Opaque } from 'type-fest';
import { Client } from '../controller/ClientController.js';
import { EntityUpdate } from '../controller/StateSyncController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { ServerState } from '../ServerState.js';
import { PartiesProperty } from './CommonProperties/PartiesProperty.js';
import { RegionProperty } from './CommonProperties/RegionProperty.js';
import { ResourcesProperty } from './CommonProperties/ResourcesProperty.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { PartyId } from './Party.js';
import { Region, RegionId } from './Region.js';
import { ResourceId } from './Resource.js';

export type SettlementId = Opaque<Uuid, 'SettlementId'>;

export type SettlementStateData = {
	name: string;
	region: RegionId;
	parties: PartyId[];
	storage: ResourceId[];
} & EntityStateData<SettlementId>;

export type SettlementClientData = SettlementStateData &
	EntityClientData<SettlementId>;

export class Settlement extends Entity<
	SettlementId,
	SettlementStateData,
	SettlementClientData
> {
	public name: string;
	private readonly regionProperty: RegionProperty;
	private readonly partiesProperty: PartiesProperty;
	private readonly storage: ResourcesProperty;

	constructor(
		protected readonly serverState: ServerState,
		data: SettlementStateData
	) {
		super(serverState, data);

		this.name = data.name;
		this.regionProperty = new RegionProperty(serverState, data.region);
		this.partiesProperty = new PartiesProperty(serverState, data.parties);
		this.storage = new ResourcesProperty(serverState, data.storage ?? []);
	}

	normalize(forClient: Client | undefined): SettlementClientData {
		return {
			entityType: this.getEntityType(),
			...this.toJSON(),
		};
	}

	toJSON(): SettlementStateData {
		return {
			id: this.id,
			name: this.name,
			region: this.regionProperty.toJSON(),
			parties: this.partiesProperty.toJSON(),
			storage: this.storage.toJSON(),
		};
	}

	override prepareUpdate(
		updateObject: EntityUpdate = {},
		forClient?: Client
	): EntityUpdate {
		if (this.getEntityRoomName() in updateObject) {
			return updateObject;
		}

		// this.getRegion().prepareUpdate(updateObject, forClient);
		this.partiesProperty.getAll().forEach((party) => {
			updateObject = party.prepareUpdate(updateObject, forClient);
		});

		return super.prepareUpdate(updateObject, forClient);
	}

	public getRegion(): Region {
		return this.regionProperty.get();
	}
}
