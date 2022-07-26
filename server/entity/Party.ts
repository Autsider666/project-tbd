import { Client } from '../controller/ClientController.js';
import { EntityUpdate } from '../controller/StateSyncController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { ResourcesProperty } from './CommonProperties/ResourcesProperty.js';
import { SettlementProperty } from './CommonProperties/SettlementProperty.js';
import { SurvivorsProperty } from './CommonProperties/SurvivorsProperty.js';
import { ResourceId } from './Resource.js';
import { Settlement, SettlementId } from './Settlement.js';
import { ServerState } from '../ServerState.js';
import { Opaque } from 'type-fest';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { Survivor, SurvivorId } from './Survivor.js';

export type PartyId = Opaque<Uuid, 'PartyId'>;

export type PartyStateData = {
	name: string;
	settlement: SettlementId;
	survivors: SurvivorId[];
	inventory: ResourceId[];
} & EntityStateData<PartyId>;

export type PartyClientData = {
	controllable: boolean;
} & PartyStateData &
	EntityClientData<PartyId>;

export class Party extends Entity<PartyId, PartyStateData, PartyClientData> {
	public name: string;
	private readonly settlementProperty: SettlementProperty;
	private readonly survivorsProperty: SurvivorsProperty;
	private readonly inventory: ResourcesProperty;

	constructor(
		protected readonly serverState: ServerState,
		data: PartyStateData
	) {
		super(serverState, data);

		this.name = data.name;
		this.settlementProperty = new SettlementProperty(
			serverState,
			data.settlement
		);
		this.survivorsProperty = new SurvivorsProperty(
			serverState,
			data.survivors
		);
		this.inventory = new ResourcesProperty(serverState, data.inventory);
	}

	public toJSON(): PartyStateData {
		return {
			id: this.id,
			name: this.name,
			settlement: this.settlementProperty.toJSON(),
			survivors: this.survivorsProperty.toJSON(),
			inventory: this.inventory.toJSON(),
		};
	}

	getUpdateRoomName(): string {
		return this.getSettlement().getUpdateRoomName();
	}

	public override normalize(forClient?: Client): PartyClientData {
		return {
			entityType: this.constructor.name.toLowerCase(),
			controllable: forClient?.parties.has(this.id) ?? false,
			...this.toJSON(),
		};
	}

	public override prepareNestedEntityUpdate(
		updateObject: EntityUpdate = {},
		forClient?: Client
	): EntityUpdate {
		this.getSurvivors().forEach((party) => {
			updateObject = party.prepareNestedEntityUpdate(
				updateObject,
				forClient
			);
		});

		return super.prepareNestedEntityUpdate(updateObject, forClient);
	}

	public getSettlement(): Settlement {
		return this.settlementProperty.get();
	}

	public getSurvivors(): Survivor[] {
		return this.survivorsProperty.getAll();
	}

	public addSurvivor(survivor: Survivor): void {
		this.survivorsProperty.add(survivor);
		if (survivor.getParty()?.getId() === this.getId()) {
			return;
		}

		survivor.setParty(this);
	}
}
