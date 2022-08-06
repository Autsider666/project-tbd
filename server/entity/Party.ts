import { Socket } from 'socket.io';
import { ResourceType } from '../config/ResourceData.js';
import {
	Survivor,
	SurvivorData,
	SurvivorDataMap,
} from '../config/SurvivorData.js';
import { Client } from '../controller/ClientController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { ExpeditionProperty } from './CommonProperties/ExpedtionProperty.js';
import { SettlementProperty } from './CommonProperties/SettlementProperty.js';
import { VoyageProperty } from './CommonProperties/VoyageProperty.js';
import {
	ResourceContainer,
	Resources,
} from './CommonTypes/ResourceContainer.js';
import { SurvivorContainer } from './CommonTypes/SurvivorContainer.js';
import { Expedition, ExpeditionId } from './Expedition.js';
import { Settlement, SettlementId } from './Settlement.js';
import { Opaque } from 'type-fest';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { Voyage, VoyageId } from './Voyage.js';

export type PartyId = Opaque<Uuid, 'PartyId'>;

export type PartyStateData = {
	name: string;
	settlement: SettlementId;
	survivors?: Survivor[];
	resources?: Resources;
	currentVoyage?: VoyageId | null;
	currentExpedition?: ExpeditionId | null;
	dead?: boolean;
} & EntityStateData<PartyId>;

export type PartyClientData = Omit<PartyStateData, 'survivors'> & {
	controllable: boolean;
	hp: number;
	damage: number;
	carryCapacity: number;
	gatheringSpeed: number;
	survivors: SurvivorData[];
} & EntityClientData<PartyId>;

export class Party
	extends Entity<PartyId, PartyStateData, PartyClientData>
	implements SurvivorContainer, ResourceContainer
{
	public name: string;
	public dead: boolean;
	private readonly settlementProperty: SettlementProperty;
	private readonly survivors: Survivor[];
	private readonly resources: Resources;
	private voyageProperty: VoyageProperty | null;
	private expeditionProperty: ExpeditionProperty | null;
	public readonly sockets: Socket[] = [];

	constructor(data: PartyStateData) {
		super(data);

		this.name = data.name;
		this.dead = data.dead ?? false;
		this.settlementProperty = new SettlementProperty(data.settlement);
		this.survivors = data.survivors ?? [];
		this.resources = data.resources ?? {};
		this.voyageProperty = data.currentVoyage
			? new VoyageProperty(data.currentVoyage)
			: null;
		this.expeditionProperty = data.currentExpedition
			? new ExpeditionProperty(data.currentExpedition)
			: null;
	}

	public toJSON(): PartyStateData {
		return {
			id: this.id,
			name: this.name,
			dead: this.dead,
			settlement: this.settlementProperty.toJSON(),
			survivors: this.survivors,
			resources: this.resources,
			currentVoyage: this.voyageProperty?.toJSON() ?? null,
			currentExpedition: this.expeditionProperty?.toJSON() ?? null,
		};
	}

	getUpdateRoomName(): string {
		return this.getSettlement().getUpdateRoomName();
	}

	public override normalize(forClient?: Client): PartyClientData {
		return {
			entityType: this.constructor.name.toLowerCase(),
			controllable: forClient?.parties.has(this.id) ?? false,
			hp: this.getHp(),
			damage: this.getDamage(),
			gatheringSpeed: this.getGatheringSpeed(),
			carryCapacity: this.getCarryCapacity(),
			...this.toJSON(),
			survivors: this.survivors.map(
				(survivor) => SurvivorDataMap[survivor]
			),
		};
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
		return this.survivors;
	}

	public addSurvivor(survivor: Survivor): void {
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

	public getExpedition(): Expedition | null {
		return this.expeditionProperty?.get() ?? null;
	}

	public setExpedition(expedition: Expedition | null): boolean {
		if (expedition !== null && this.expeditionProperty !== null) {
			return false;
		}

		if (expedition === null) {
			this.expeditionProperty = null; //TODO handle stopped expedition
			return true;
		}

		if (this.expeditionProperty === null) {
			this.expeditionProperty = new ExpeditionProperty(expedition);
		} else {
			this.expeditionProperty.set(expedition); //TODO handle setting party in expedition
		}

		return true;
	}

	public getHp(): number {
		let hp = 0;
		this.getSurvivors().forEach(
			(survivor) => (hp += SurvivorDataMap[survivor].stats.hp)
		);

		return hp;
	}

	public getDamage(): number {
		let damage = 0;
		this.getSurvivors().forEach(
			(survivor) => (damage += SurvivorDataMap[survivor].stats.damage)
		);

		return damage;
	}

	public getGatheringSpeed(): number {
		let gatheringSpeed = 0;
		this.getSurvivors().forEach(
			(survivor) =>
				(gatheringSpeed +=
					SurvivorDataMap[survivor].stats.gatheringSpeed)
		);

		return gatheringSpeed;
	}

	public getCarryCapacity(): number {
		let carryCapacity = 0;
		this.getSurvivors().forEach(
			(survivor) =>
				(carryCapacity += SurvivorDataMap[survivor].stats.carryCapacity)
		);

		return carryCapacity;
	}

	public getResources(): Resources {
		return this.resources;
	}

	public deleteResource(type: ResourceType): void {
		delete this.resources[type];
	}

	transferSurvivorTo(
		survivor: Survivor,
		newContainer: SurvivorContainer
	): void {
		if (this.removeSurvivor(survivor)) {
			newContainer.addSurvivor(survivor);
		}
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
}
