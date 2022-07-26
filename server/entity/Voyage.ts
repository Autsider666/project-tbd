import { Opaque } from 'type-fest';
import { Client } from '../controller/ClientController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { ServerState } from '../ServerState.js';
import { PartyProperty } from './CommonProperties/PartyProperty.js';
import { SettlementProperty } from './CommonProperties/SettlementProperty.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { Party, PartyId } from './Party.js';
import { Settlement, SettlementId } from './Settlement.js';

export type VoyageId = Opaque<Uuid, 'VoyageId'>;

export type VoyageStateData = {
	party: PartyId;
	origin: SettlementId;
	target: SettlementId;
	startedAt: Date;
	arrivalAt: Date;
	handled: boolean;
} & EntityStateData<VoyageId>;

export type VoyageClientData = VoyageStateData & EntityClientData<VoyageId>;

export class Voyage extends Entity<
	VoyageId,
	VoyageStateData,
	VoyageClientData
> {
	private readonly partyProperty: PartyProperty;
	private readonly originProperty: SettlementProperty;
	private readonly targetProperty: SettlementProperty;
	public readonly startedAt: Date;
	public readonly arrivalAt: Date;
	public handled: boolean;

	constructor(serverState: ServerState, data: VoyageStateData) {
		super(serverState, data);

		this.partyProperty = new PartyProperty(serverState, data.party);
		this.originProperty = new SettlementProperty(serverState, data.origin);
		this.targetProperty = new SettlementProperty(serverState, data.target);
		this.startedAt = data.startedAt;
		this.arrivalAt = data.arrivalAt;
		this.handled = data.handled;
	}

	getUpdateRoomName(): string {
		return this.partyProperty.get().getUpdateRoomName();
	}

	normalize(forClient?: Client): VoyageClientData {
		return {
			entityType: this.getEntityType(),
			...this.toJSON(),
		};
	}

	toJSON(): VoyageStateData {
		return {
			id: this.id,
			party: this.partyProperty.toJSON(),
			origin: this.originProperty.toJSON(),
			target: this.targetProperty.toJSON(),
			startedAt: this.startedAt,
			arrivalAt: this.arrivalAt,
			handled: this.handled,
		};
	}

	public getParty(): Party {
		return this.partyProperty.get();
	}

	public getTarget(): Settlement {
		return this.targetProperty.get();
	}
}
