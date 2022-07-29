import { Opaque } from 'type-fest';
import { Client } from '../controller/ClientController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { PartyProperty } from './CommonProperties/PartyProperty.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { Party, PartyId } from './Party.js';

export type SurvivorId = Opaque<Uuid, 'SurvivorId'>;

export type SurvivorStateData = {
	name: string;
	party?: PartyId | null;
	hp: number;
	damage: number;
	carryCapacity: number;
	gatheringSpeed: number;
} & EntityStateData<SurvivorId>;

export type SurvivorClientDate = SurvivorStateData &
	EntityClientData<SurvivorId>;

export class Survivor extends Entity<
	SurvivorId,
	SurvivorStateData,
	SurvivorClientDate
> {
	private readonly name: string;
	private partyProperty: PartyProperty | null;
	public readonly hp: number;
	public readonly damage: number;
	public readonly carryCapacity: number;
	public readonly gatheringSpeed: number;

	constructor(data: SurvivorStateData) {
		super(data);

		this.name = data.name;
		this.partyProperty = data.party ? new PartyProperty(data.party) : null;
		this.hp = data.hp;
		this.damage = data.hp;
		this.carryCapacity = data.carryCapacity;
		this.gatheringSpeed = data.gatheringSpeed;
	}

	public getParty(): Party | null {
		return this.partyProperty?.get() ?? null;
	}

	public setParty(party: Party): void {
		if (this.getParty()?.getId() === party.getId()) {
			return;
		}
		if (this.partyProperty) {
			this.partyProperty.set(party);
		} else {
			this.partyProperty = new PartyProperty(party);
		}

		party.addSurvivor(this);
	}

	normalize(forClient: Client): SurvivorClientDate {
		return {
			entityType: this.getEntityType(),
			...this.toJSON(),
		};
	}

	toJSON(): SurvivorStateData {
		return {
			id: this.id,
			name: this.name,
			hp: this.hp,
			damage: this.damage,
			carryCapacity: this.carryCapacity,
			gatheringSpeed: this.gatheringSpeed,
			party: this.partyProperty?.toJSON() ?? null,
		};
	}

	getUpdateRoomName(): string {
		return this.getParty()?.getEntityRoomName() ?? ''; //TODO add settlement?
	}
}
