import { Opaque } from 'type-fest';
import { Client } from '../controller/ClientController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { PartyProperty } from './CommonProperties/PartyProperty.js';
import { ResourceNodeProperty } from './CommonProperties/ResourceNodeProperty.js';
import { SettlementProperty } from './CommonProperties/SettlementProperty.js';
import { Enemy } from './CommonTypes/Combat.js';
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
	origin: SettlementId;
	target: ResourceNodeId;
	startedAt: string;
	currentPhase: ExpeditionPhase;
	currentPhaseStartedAt?: string | null;
	currentPhaseEndsAt: string | null;
	previousPhase?: ExpeditionPhase | null;
	previousPhaseEndedAt?: string | null;
	damageTaken?: number;
	enemy?: Enemy | null;
} & EntityStateData<ExpeditionId>;

export type ExpeditionClientData = ExpeditionStateData &
	EntityClientData<ExpeditionId>;

export class Expedition extends Entity<
	ExpeditionId,
	ExpeditionStateData,
	ExpeditionClientData
> {
	private readonly partyProperty: PartyProperty;
	private currentPhase: ExpeditionPhase;
	public previousPhase: ExpeditionPhase | null = null;
	private readonly originProperty: SettlementProperty;
	private readonly targetProperty: ResourceNodeProperty;
	public readonly startedAt: string;
	private currentPhaseStartedAt: string;
	private currentPhaseEndsAt: string | null;
	public previousPhaseEndedAt: string | null;
	public damageTaken: number;
	public enemy: Enemy | null;

	constructor(data: ExpeditionStateData) {
		super(data);

		this.partyProperty = new PartyProperty(data.party);
		this.currentPhase = data.currentPhase;
		this.previousPhase = data.previousPhase ?? null;
		this.originProperty = new SettlementProperty(data.origin);
		this.targetProperty = new ResourceNodeProperty(data.target);
		this.startedAt = data.startedAt;
		this.currentPhaseStartedAt =
			data.currentPhaseStartedAt ?? new Date().toString();
		this.currentPhaseEndsAt = data.currentPhaseEndsAt ?? null;
		this.previousPhaseEndedAt = data.previousPhaseEndedAt ?? null;
		this.damageTaken = data.damageTaken ?? 0;
		this.enemy = data.enemy ?? null;
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
			origin: this.originProperty.toJSON(),
			target: this.targetProperty.toJSON(),
			startedAt: this.startedAt,
			currentPhase: this.currentPhase,
			currentPhaseStartedAt: this.currentPhaseStartedAt,
			currentPhaseEndsAt: this.currentPhaseEndsAt,
			previousPhase: this.previousPhase,
			previousPhaseEndedAt: this.previousPhaseEndedAt,
			damageTaken: this.damageTaken,
			enemy: this.enemy,
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

	public getCurrentPhase(): ExpeditionPhase {
		return this.currentPhase;
	}

	public getCurrentPhaseEndsAt(): string | null {
		return this.currentPhaseEndsAt;
	}

	public getCurrentPhaseStartedAt(): string | null {
		return this.currentPhaseStartedAt;
	}

	public setCurrentPhase(
		phase: ExpeditionPhase,
		currentDate: Date,
		phaseEndsAt: Date | null = null
	): void {
		this.previousPhase = this.currentPhase;
		this.currentPhase = phase;
		this.currentPhaseStartedAt = currentDate.toString();

		this.previousPhaseEndedAt = this.currentPhaseEndsAt;
		this.currentPhaseEndsAt = phaseEndsAt?.toString() || null;
	}
}
