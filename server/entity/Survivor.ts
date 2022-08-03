import { container } from 'tsyringe';
import { Opaque } from 'type-fest';
import { ServerConfig } from '../serverConfig.js';
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
	public readonly name: string;
	public readonly hp: number;
	public readonly damage: number;
	public readonly carryCapacity: number;
	public readonly gatheringSpeed: number;
	private readonly gatheringSpeedMultiplier: number = container
		.resolve(ServerConfig)
		.get('gatherSpeedMultiplier');

	public owner: SurvivorContainer | null = null;

	constructor(data: SurvivorStateData) {
		super(data);

		this.name = data.name;
		this.hp = data.hp;
		this.damage = data.damage;
		this.carryCapacity = data.carryCapacity;
		this.gatheringSpeed =
			data.gatheringSpeed * this.gatheringSpeedMultiplier;
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
