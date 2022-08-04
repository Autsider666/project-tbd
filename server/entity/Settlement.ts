import { Opaque } from 'type-fest';
import { Client } from '../controller/ClientController.js';
import { EntityUpdate } from '../controller/StateSyncController.js';
import { ClientNotifier } from '../helper/ClientNotifier.js';
import { Uuid } from '../helper/UuidHelper.js';
import { PartiesProperty } from './CommonProperties/PartiesProperty.js';
import { RegionProperty } from './CommonProperties/RegionProperty.js';
import { ResourcesProperty } from './CommonProperties/ResourcesProperty.js';
import { SurvivorsProperty } from './CommonProperties/SurvivorsProperty.js';
import { Combatant, Enemy } from './CommonTypes/Combat.js';
import { ResourceContainer } from './CommonTypes/ResourceContainer.js';
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
	damageTaken?: number;
	raid?: Enemy | null;
	parties?: PartyId[];
	storage?: ResourceId[];
	survivors?: SurvivorId[];
	destroyed?: boolean;
	settlementUpgrade?: SettlementUpgrade | null;
	buildings?: { [key in SettlementBuilding]: number };
} & Combatant &
	EntityStateData<SettlementId>;

export enum SettlementBuilding {
	Wall = 'wall',
	Tower = 'tower',
}

export const BuildingCost: { [key in SettlementBuilding]: ResourceType } = {
	[SettlementBuilding.Wall]: ResourceType.stone,
	[SettlementBuilding.Tower]: ResourceType.iron,
};

export type SettlementUpgrade = {
	type: SettlementBuilding;
	remainingWork: number;
};

export type SettlementClientData = SettlementStateData &
	EntityClientData<SettlementId>;

export class Settlement
	extends Entity<SettlementId, SettlementStateData, SettlementClientData>
	implements SurvivorContainer, ResourceContainer, Combatant
{
	public name: string;
	private readonly regionProperty: RegionProperty;
	private readonly partiesProperty: PartiesProperty;
	private readonly storage: ResourcesProperty;
	private readonly survivorsProperty: SurvivorsProperty;

	hp: number;
	damage: number;
	damageTaken: number;
	raid: Enemy | null;
	destroyed: boolean;
	settlementUpgrade: SettlementUpgrade | null;
	buildings: { [key in SettlementBuilding]: number };

	constructor(data: SettlementStateData) {
		super(data);

		this.name = data.name;
		this.hp = data.hp ?? 10000; //TODO remove BC
		this.damage = data.damage ?? 100; //TODO remove BC
		this.damageTaken = data.damageTaken ?? 0;
		this.raid = data.raid ?? null;
		this.destroyed = data.destroyed ?? false;
		this.settlementUpgrade = data.settlementUpgrade ?? null;
		this.buildings = data.buildings ?? {
			[SettlementBuilding.Tower]: 0,
			[SettlementBuilding.Wall]: 0,
		};
		this.regionProperty = new RegionProperty(data.region);
		this.partiesProperty = new PartiesProperty(data.parties ?? []);
		this.storage = new ResourcesProperty(data.storage ?? [], this);
		this.survivorsProperty = new SurvivorsProperty(
			data.survivors ?? [],
			this
		);
	}

	normalize(forClient: Client | undefined): SettlementClientData {
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
			survivors: this.survivorsProperty.toJSON(),
			hp: this.hp,
			damage: this.damage,
			damageTaken: this.damageTaken,
			destroyed: this.destroyed,
			raid: this.raid,
			settlementUpgrade: this.settlementUpgrade,
			buildings: this.buildings,
		};
	}

	getUpdateRoomName(): string {
		return this.getRegion().getUpdateRoomName();
	}

	async prepareNestedEntityUpdate(
		updateObject: EntityUpdate = {},
		forClient?: Client
	): Promise<EntityUpdate> {
		if (this.getEntityRoomName() in updateObject) {
			return updateObject;
		}

		// this.getRegion().prepareUpdate(updateObject, forClient); //TODO add later when it works

		for (const party of this.getParties()) {
			updateObject = await party.prepareNestedEntityUpdate(
				updateObject,
				forClient
			);
		}

		for (const survivor of this.getSurvivors()) {
			updateObject = await survivor.prepareNestedEntityUpdate(
				updateObject,
				forClient
			);
		}

		return super.prepareNestedEntityUpdate(updateObject, forClient);
	}

	public getRegion(): Region {
		return this.regionProperty.get();
	}

	public addParty(party: Party): void {
		if (this.partiesProperty.has(party)) {
			return;
		}

		this.partiesProperty.add(party);

		if (party.getSettlement().getId() === this.getId()) {
			return;
		}

		party.getSettlement().removeParty(party);
	}

	public removeParty(party: Party): void {
		this.partiesProperty.remove(party.getId());
	}

	public getParties(): Party[] {
		return this.partiesProperty.getAll();
	}

	public addResource(amount: number, type: ResourceType): void {
		this.storage.addResource(amount, type);
	}

	addSurvivor(survivor: Survivor): void {
		this.survivorsProperty.add(survivor);
	}

	removeSurvivor(survivor: Survivor): void {
		this.survivorsProperty.remove(survivor.getId());
	}

	transferSurvivorTo(
		survivor: Survivor,
		newContainer: SurvivorContainer
	): void {
		this.survivorsProperty.transferSurvivorTo(survivor, newContainer);
	}

	getSurvivors(): Survivor[] {
		return this.survivorsProperty.getAll();
	}

	removeResource(amount: number, type: ResourceType): void {
		for (const resource of this.storage.getAll()) {
			if (resource.type !== type) {
				continue;
			}

			if (resource.getAmount() < amount) {
				throw new Error(`Settlement does not have ${amount} ${type}.`);
			}

			resource.removeAmount(amount);
			break;
		}
	}

	getResource(type: ResourceType): number {
		for (const resource of this.storage.getAll()) {
			if (resource.type !== type) {
				continue;
			}

			return resource.getAmount();
		}

		return 0;
	}

	destroy(): void {
		this.destroyed = true;
		for (const resource of this.storage.getAll()) {
			this.storage.remove(resource.getId());
		}

		for (const survivor of this.survivorsProperty.getAll()) {
			this.survivorsProperty.remove(survivor.getId());
		}

		for (const party of this.partiesProperty
			.getAll()
			.filter((party) => party.getVoyage() === null)) {
			party.dead = true;
			ClientNotifier.warning(
				`Party "${party.name}" has died during the raid on settlement "${this.name}"`,
				party.getUpdateRoomName()
			);
		}
	}

	upgradeBuilding(type: SettlementBuilding): void {
		this.buildings[type]++;
		switch (type) {
			case SettlementBuilding.Tower:
				this.damage += 100;
				break;
			case SettlementBuilding.Wall:
				this.hp += 1000;
				this.damageTaken = Math.max(0, this.damageTaken - 1000);
				break;
		}
	}
}
