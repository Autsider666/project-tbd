import { Opaque } from 'type-fest';
import { Client } from '../controller/ClientController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { SurvivorContainer } from './CommonTypes/SurvivorContainer.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';

export type SurvivorId = Opaque<Uuid, 'SurvivorId'>;

export type SurvivorStateData = {
	name: string;
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
	public readonly hp: number;
	public readonly damage: number;
	public readonly carryCapacity: number;
	public readonly gatheringSpeed: number;

	public owner: SurvivorContainer | null = null;

	constructor(data: SurvivorStateData) {
		super(data);

		this.name = data.name;
		this.hp = data.hp;
		this.damage = data.hp;
		this.carryCapacity = data.carryCapacity;
		this.gatheringSpeed = data.gatheringSpeed;
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
		};
	}

	getUpdateRoomName(): string {
		return this.owner?.getEntityRoomName() ?? '';
	}
}
