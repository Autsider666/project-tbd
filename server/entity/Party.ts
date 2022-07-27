import { Socket } from 'socket.io';
import { Client } from '../controller/ClientController.js';
import { EntityUpdate } from '../controller/StateSyncController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { ResourcesProperty } from './CommonProperties/ResourcesProperty.js';
import { SettlementProperty } from './CommonProperties/SettlementProperty.js';
import { SurvivorsProperty } from './CommonProperties/SurvivorsProperty.js';
import { VoyageProperty } from './CommonProperties/VoyageProperty.js';
import { ResourceId } from './Resource.js';
import { Settlement, SettlementId } from './Settlement.js';
import { Opaque } from 'type-fest';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { Survivor, SurvivorId } from './Survivor.js';
import { Voyage, VoyageId } from './Voyage.js';

export type PartyId = Opaque<Uuid, 'PartyId'>;

export type PartyStateData = {
	name: string;
	settlement: SettlementId;
	survivors: SurvivorId[];
	inventory: ResourceId[];
	currentVoyage?: VoyageId;
} & EntityStateData<PartyId>;

export type PartyClientData = {
	controllable: boolean;
} & PartyStateData &
	EntityClientData<PartyId>;

export class Party extends Entity<PartyId, PartyStateData, PartyClientData> {
	public name: string;
	private readonly settlementProperty: SettlementProperty;
	private readonly survivorsProperty: SurvivorsProperty;
	private readonly inventoryProperty: ResourcesProperty;
	private voyageProperty: VoyageProperty | null;
	public readonly sockets: Socket[] = [];

	constructor(data: PartyStateData) {
		super(data);

		this.name = data.name;
		this.settlementProperty = new SettlementProperty(data.settlement);
		this.survivorsProperty = new SurvivorsProperty(data.survivors);
		this.inventoryProperty = new ResourcesProperty(data.inventory);
		this.voyageProperty = data.currentVoyage
			? new VoyageProperty(data.currentVoyage)
			: null;
	}

	public toJSON(): PartyStateData {
		return {
			id: this.id,
			name: this.name,
			settlement: this.settlementProperty.toJSON(),
			survivors: this.survivorsProperty.toJSON(),
			inventory: this.inventoryProperty.toJSON(),
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

	public setSettlement(settlement: Settlement): void {
		if (
			this.settlementProperty.get().getUpdateRoomName() !==
			settlement.getUpdateRoomName()
		) {
			throw new Error('Settlement is not in the same world');
		}

		const currentSettlement = this.settlementProperty.get();
		this.settlementProperty.set(settlement);
		currentSettlement.removeParty(this);
		settlement.addParty(this);
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

	public getVoyage(): Voyage | null {
		return this.voyageProperty?.get() ?? null;
	}

	public setVoyage(voyage: Voyage | null): boolean {
		if (voyage !== null && this.voyageProperty !== null) {
			return false;
		}

		if (voyage === null) {
			this.voyageProperty = null; //TODO handle stopped voyage
			return true;
		}

		if (this.voyageProperty === null) {
			this.voyageProperty = new VoyageProperty(voyage);
		} else {
			this.voyageProperty.set(voyage); //TODO handle setting party in voyage
		}

		return true;
	}
}
