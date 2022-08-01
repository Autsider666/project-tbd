import { Opaque } from 'type-fest';
import { Client } from '../controller/ClientController.js';
import { EntityUpdate } from '../controller/StateSyncController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { PartiesProperty } from './CommonProperties/PartiesProperty.js';
import { RegionProperty } from './CommonProperties/RegionProperty.js';
import { ResourcesProperty } from './CommonProperties/ResourcesProperty.js';
import { SurvivorsProperty } from './CommonProperties/SurvivorsProperty.js';
import { SurvivorContainer } from './CommonTypes/SurvivorContainer.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { Party, PartyId } from './Party.js';
import { Region, RegionId } from './Region.js';
import { ResourceId, ResourceType } from './Resource.js';
import { Survivor, SurvivorId } from './Survivor.js';

export type SettlementId = Opaque<Uuid, 'SettlementId'>;

export type SettlementStateData = {
	name: string;
	region: RegionId;
	parties?: PartyId[];
	storage?: ResourceId[];
	survivors?: SurvivorId[];
} & EntityStateData<SettlementId>;

export type SettlementClientData = SettlementStateData &
	EntityClientData<SettlementId>;

export class Settlement
	extends Entity<SettlementId, SettlementStateData, SettlementClientData>
	implements SurvivorContainer
{
	public name: string;
	private readonly regionProperty: RegionProperty;
	private readonly partiesProperty: PartiesProperty;
	private readonly storage: ResourcesProperty;
	private readonly survivorsProperty: SurvivorsProperty;

	constructor(data: SettlementStateData) {
		super(data);

		this.name = data.name;
		this.regionProperty = new RegionProperty(data.region);
		this.partiesProperty = new PartiesProperty(data.parties ?? []);
		this.storage = new ResourcesProperty(data.storage ?? [], this);
		this.survivorsProperty = new SurvivorsProperty(
			data.survivors ?? [],
			this
		);
	}

	async normalize(
		forClient: Client | undefined
	): Promise<SettlementClientData> {
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

	async getUpdateRoomName(): Promise<string> {
		return (await this.getRegion()).getUpdateRoomName();
	}

	async prepareNestedEntityUpdate(
		updateObject: EntityUpdate = {},
		forClient?: Client
	): Promise<EntityUpdate> {
		if (this.getEntityRoomName() in updateObject) {
			return updateObject;
		}

		// this.getRegion().prepareUpdate(updateObject, forClient); //TODO add later when it works

		for (const party of await this.getParties()) {
			updateObject = await party.prepareNestedEntityUpdate(
				updateObject,
				forClient
			);
		}

		for (const survivor of await this.getSurvivors()) {
			updateObject = await survivor.prepareNestedEntityUpdate(
				updateObject,
				forClient
			);
		}

		return super.prepareNestedEntityUpdate(updateObject, forClient);
	}

	public async getRegion(): Promise<Region> {
		return this.regionProperty.get();
	}

	public async addParty(party: Party) {
		if (this.partiesProperty.has(party)) {
			return;
		}

		await this.partiesProperty.add(party);

		if ((await party.getSettlement()).getId() === this.getId()) {
			return;
		}

		await (await party.getSettlement()).removeParty(party);
	}

	public async removeParty(party: Party) {
		await this.partiesProperty.remove(party.getId());
	}

	public async getParties(): Promise<Party[]> {
		return this.partiesProperty.getAll();
	}

	public async addResource(amount: number, type: ResourceType) {
		await this.storage.addResource(amount, type);
	}

	async addSurvivor(survivor: Survivor) {
		await this.survivorsProperty.add(survivor);
	}

	async transferSurvivorTo(
		survivor: Survivor,
		newContainer: SurvivorContainer
	) {
		await this.survivorsProperty.transferSurvivorTo(survivor, newContainer);
	}

	async getSurvivors(): Promise<Survivor[]> {
		return this.survivorsProperty.getAll();
	}
}
