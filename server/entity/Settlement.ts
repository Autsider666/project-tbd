import { Opaque } from 'type-fest';
import { ResourceType } from '../config/ResourceData.js';
import {
	Survivor,
	SurvivorData,
	SurvivorDataMap,
} from '../config/SurvivorData.js';
import { Client } from '../controller/ClientController.js';
import { EntityUpdate } from '../controller/StateSyncController.js';
import { ClientNotifier } from '../helper/ClientNotifier.js';
import { Uuid } from '../helper/UuidHelper.js';
import { PartiesProperty } from './CommonProperties/PartiesProperty.js';
import { RegionProperty } from './CommonProperties/RegionProperty.js';
import { Combatant, Enemy } from './CommonTypes/Combat.js';
import {
	generateEmptyResourcesObject,
	ResourceContainer,
	Resources,
} from './CommonTypes/ResourceContainer.js';
import { SurvivorContainer } from './CommonTypes/SurvivorContainer.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { Party, PartyId } from './Party.js';
import { Region, RegionId } from './Region.js';

export type SettlementId = Opaque<Uuid, 'SettlementId'>;

export type SettlementStateData = {
	name: string;
	region: RegionId;
	damageTaken?: number;
	raid?: Enemy | null;
	parties?: PartyId[];
	resources?: Resources;
	survivors?: Survivor[];
	destroyed?: boolean;
	settlementUpgrade?: SettlementUpgrade | null;
	buildings?: { [key in SettlementBuilding]: number };
} & Combatant &
	EntityStateData<SettlementId>;

export enum SettlementBuilding {
	Wall = 'Wall',
	Tower = 'Tower',
}

export const BuildingCost: { [key in SettlementBuilding]: ResourceType } = {
	[SettlementBuilding.Wall]: ResourceType.stone,
	[SettlementBuilding.Tower]: ResourceType.iron,
};

export type SettlementUpgrade = {
	type: SettlementBuilding;
	remainingWork: number;
};

export type SettlementClientData = Omit<SettlementStateData, 'survivors'> & {
	survivors: SurvivorData[];
} & EntityClientData<SettlementId>;

export class Settlement
	extends Entity<SettlementId, SettlementStateData, SettlementClientData>
	implements SurvivorContainer, ResourceContainer, Combatant
{
	public name: string;
	private readonly regionProperty: RegionProperty;
	private readonly partiesProperty: PartiesProperty;
	private resources: Resources;
	private survivors: Survivor[];

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
		this.resources = data.resources ?? generateEmptyResourcesObject();
		this.survivors = data.survivors ?? [];
	}

	normalize(forClient: Client | undefined): SettlementClientData {
		return {
			entityType: this.getEntityType(),
			...this.toJSON(),
			survivors: this.survivors.map(
				(survivor) => SurvivorDataMap[survivor]
			),
		};
	}

	toJSON(): SettlementStateData {
		return {
			id: this.id,
			name: this.name,
			region: this.regionProperty.toJSON(),
			parties: this.partiesProperty.toJSON(),
			resources: { ...generateEmptyResourcesObject(), ...this.resources },
			survivors: this.survivors,
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

		for (const party of this.getParties()) {
			updateObject = await party.prepareNestedEntityUpdate(
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

	addSurvivor(survivor: Survivor): void {
		this.survivors.push(survivor);
	}

	public removeSurvivor(survivor: Survivor): boolean {
		const index = this.survivors.findIndex(
			(partyMember) => partyMember === survivor
		);
		if (index === -1) {
			return false;
		}

		this.survivors.splice(index, 1);

		return true;
	}

	transferSurvivorTo(
		survivor: Survivor,
		newContainer: SurvivorContainer
	): void {
		if (this.removeSurvivor(survivor)) {
			newContainer.addSurvivor(survivor);
		}
	}

	getSurvivors(): Survivor[] {
		return this.survivors;
	}

	addResource(amount: number, type: ResourceType): void {
		this.resources[type] = (this.resources[type] ?? 0) + amount;
	}

	removeResource(amount: number, type: ResourceType): boolean {
		if (!(type in this.resources)) {
			this.resources[type] = 0;
		}

		if ((this.resources[type] ?? 0) < amount) {
			return false;
		}

		this.resources[type] = Math.max(
			0,
			(this.resources[type] ?? 0) - amount
		);

		return true;
	}

	destroy(): void {
		this.destroyed = true;
		this.resources = generateEmptyResourcesObject();
		this.survivors = [];

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
