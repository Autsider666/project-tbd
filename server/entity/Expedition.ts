import { Opaque } from 'type-fest';
import { Client } from '../controller/ClientController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { PartyProperty } from './CommonProperties/PartyProperty.js';
import { ResourceNodeProperty } from './CommonProperties/ResourceNodeProperty.js';
import { SettlementProperty } from './CommonProperties/SettlementProperty.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { Party, PartyId } from './Party.js';
import { ResourceNode, ResourceNodeId } from './ResourceNode.js';
import { Settlement, SettlementId } from './Settlement.js';

export type ExpeditionId = Opaque<Uuid, 'ExpeditionId'>;

export enum ExpeditionPhase {
	travel = 'travel',
	gather = 'gather',
	combat = 'combat',
	returning = 'returning',
	finished = 'finished',
}

export type ExpeditionStateData = {
	party: PartyId;
	phase: ExpeditionPhase;
	origin: SettlementId;
	target: ResourceNodeId;
	startedAt: Date;
	nextPhaseAt: Date;
} & EntityStateData<ExpeditionId>;

export type ExpeditionClientData = ExpeditionStateData &
	EntityClientData<ExpeditionId>;

export class Expedition extends Entity<
	ExpeditionId,
	ExpeditionStateData,
	ExpeditionClientData
> {
	private readonly partyProperty: PartyProperty;
	public phase: ExpeditionPhase;
	private readonly originProperty: SettlementProperty;
	private readonly targetProperty: ResourceNodeProperty;
	public readonly startedAt: Date;
	public nextPhaseAt: Date;

	constructor(data: ExpeditionStateData) {
		super(data);

		this.partyProperty = new PartyProperty(data.party);
		this.phase = data.phase;
		this.originProperty = new SettlementProperty(data.origin);
		this.targetProperty = new ResourceNodeProperty(data.target);
		this.startedAt = data.startedAt;
		this.nextPhaseAt = data.nextPhaseAt;
	}

	normalize(forClient?: Client): ExpeditionClientData {
		return {
			entityType: this.getEntityType(),
			...this.toJSON(),
		};
	}

	toJSON(): ExpeditionStateData {
		return {
			id: this.id,
			party: this.partyProperty.toJSON(),
			phase: this.phase,
			origin: this.originProperty.toJSON(),
			target: this.targetProperty.toJSON(),
			startedAt: this.startedAt,
			nextPhaseAt: this.nextPhaseAt,
		};
	}

	getUpdateRoomName(): string {
		return this.getParty().getEntityRoomName();
	}

	public getParty(): Party {
		return this.partyProperty.get();
	}

	public getTarget(): ResourceNode {
		return this.targetProperty.get();
	}

	public getOrigin(): Settlement {
		return this.originProperty.get();
	}
}
