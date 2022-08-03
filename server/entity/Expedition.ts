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

export interface Enemy {
	name: string;
	hp: number;
	damageTaken: number;
	damage: number;
}

export type ExpeditionStateData = {
	party: PartyId;
	origin: SettlementId;
	target: ResourceNodeId;
	startedAt: Date;
	currentPhase: ExpeditionPhase;
	currentPhaseStartedAt?: Date;
	currentPhaseEndsAt: Date | null;
	previousPhase?: ExpeditionPhase | null;
	previousPhaseEndedAt?: Date | null;
	damageTaken?: number;
	enemy?: Enemy | null;
} & EntityStateData<ExpeditionId>;

export type ExpeditionClientData = {
	phase: ExpeditionPhase; //TODO remove BC
} & ExpeditionStateData &
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
	public readonly startedAt: Date;
	private currentPhaseStartedAt: Date;
	private currentPhaseEndsAt: Date | null;
	public previousPhaseEndedAt: Date | null;
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
		this.currentPhaseStartedAt = data.currentPhaseStartedAt ?? new Date();
		this.currentPhaseEndsAt = data.currentPhaseEndsAt;
		this.previousPhaseEndedAt = data.previousPhaseEndedAt ?? null;
		this.damageTaken = data.damageTaken ?? 0;
		this.enemy = data.enemy ?? null;
	}

	normalize(forClient?: Client): ExpeditionClientData {
		return {
			entityType: this.getEntityType(),
			phase: this.currentPhase,
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

	public getCurrentPhaseEndsAt(): Date | null {
		return this.currentPhaseEndsAt;
	}

	public getCurrentPhaseStartedAt(): Date | null {
		return this.currentPhaseStartedAt;
	}

	public setCurrentPhase(
		phase: ExpeditionPhase,
		currentDate: Date,
		phaseEndsAt: Date | null = null
	): void {
		this.previousPhase = this.currentPhase;
		this.currentPhase = phase;
		this.currentPhaseStartedAt = currentDate;

		this.previousPhaseEndedAt = this.currentPhaseEndsAt;
		this.currentPhaseEndsAt = phaseEndsAt;
	}
}
