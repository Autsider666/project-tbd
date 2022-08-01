import { Socket } from 'socket.io';
import { Client } from '../controller/ClientController.js';
import { EntityUpdate } from '../controller/StateSyncController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { ExpeditionProperty } from './CommonProperties/ExpedtionProperty.js';
import { ResourcesProperty } from './CommonProperties/ResourcesProperty.js';
import { SettlementProperty } from './CommonProperties/SettlementProperty.js';
import { SurvivorsProperty } from './CommonProperties/SurvivorsProperty.js';
import { VoyageProperty } from './CommonProperties/VoyageProperty.js';
import { SurvivorContainer } from './CommonTypes/SurvivorContainer.js';
import { Expedition, ExpeditionId } from './Expedition.js';
import { Resource, ResourceId, ResourceType } from './Resource.js';
import { Settlement, SettlementId } from './Settlement.js';
import { Opaque } from 'type-fest';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { Survivor, SurvivorId } from './Survivor.js';
import { Voyage, VoyageId } from './Voyage.js';

export type PartyId = Opaque<Uuid, 'PartyId'>;

export type PartyStateData = {
	name: string;
	settlement: SettlementId;
	survivors?: SurvivorId[];
	inventory?: ResourceId[];
	currentVoyage?: VoyageId;
	currentExpedition?: ExpeditionId;
} & EntityStateData<PartyId>;

export type PartyClientData = {
	controllable: boolean;
	hp: number;
	damage: number;
	carryCapacity: number;
	gatheringSpeed: number;
} & PartyStateData &
	EntityClientData<PartyId>;

export class Party
	extends Entity<PartyId, PartyStateData, PartyClientData>
	implements SurvivorContainer
{
	public name: string;
	private readonly settlementProperty: SettlementProperty;
	private readonly survivorsProperty: SurvivorsProperty;
	private readonly inventoryProperty: ResourcesProperty;
	private voyageProperty: VoyageProperty | null;
	private expeditionProperty: ExpeditionProperty | null;
	public readonly sockets: Socket[] = [];

	constructor(data: PartyStateData) {
		super(data);

		this.name = data.name;
		this.settlementProperty = new SettlementProperty(data.settlement);
		this.survivorsProperty = new SurvivorsProperty(
			data.survivors ?? [],
			this
		);
		this.inventoryProperty = new ResourcesProperty(
			data.inventory ?? [],
			this
		);
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
			settlement: this.settlementProperty.toJSON(),
			survivors: this.survivorsProperty.toJSON(),
			inventory: this.inventoryProperty.toJSON(),
		};
	}

	async getUpdateRoomName(): Promise<string> {
		return (await this.getSettlement()).getUpdateRoomName();
	}

	public async normalize(forClient?: Client): Promise<PartyClientData> {
		return {
			entityType: this.constructor.name.toLowerCase(),
			controllable: forClient?.parties.has(this.id) ?? false,
			hp: await this.getHp(),
			damage: await this.getDamage(),
			gatheringSpeed: await this.getGatheringSpeed(),
			carryCapacity: await this.getCarryCapacity(),
			...this.toJSON(),
		};
	}

	public async prepareNestedEntityUpdate(
		updateObject: EntityUpdate = {},
		forClient?: Client
	): Promise<EntityUpdate> {
		for (const survivor of await this.getSurvivors()) {
			updateObject = await survivor.prepareNestedEntityUpdate(
				updateObject,
				forClient
			);
		}

		return super.prepareNestedEntityUpdate(updateObject, forClient);
	}

	public async getSettlement(): Promise<Settlement> {
		return this.settlementProperty.get();
	}

	public async setSettlement(settlement: Settlement) {
		if (
			(await (
				await this.settlementProperty.get()
			).getUpdateRoomName()) !== (await settlement.getUpdateRoomName())
		) {
			throw new Error('Settlement is not in the same world');
		}

		const currentSettlement = await this.settlementProperty.get();
		await this.settlementProperty.set(settlement);
		await currentSettlement.removeParty(this);
		await settlement.addParty(this);
	}

	public async getSurvivors(): Promise<Survivor[]> {
		return this.survivorsProperty.getAll();
	}

	public addSurvivor(survivor: Survivor): void {
		this.survivorsProperty.add(survivor);
	}

	public async getVoyage(): Promise<Voyage | null> {
		return this.voyageProperty?.get() ?? null;
	}

	public async setVoyage(voyage: Voyage | null): Promise<boolean> {
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
			await this.voyageProperty.set(voyage); //TODO handle setting party in voyage
		}

		return true;
	}

	public async getExpedition(): Promise<Expedition | null> {
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

	public async getHp(): Promise<number> {
		let hp = 0;
		for (const survivor of await this.getSurvivors()) {
			hp += survivor.hp;
		}

		return hp;
	}

	public async getDamage(): Promise<number> {
		let damage = 0;
		for (const survivor of await this.getSurvivors()) {
			damage += survivor.damage;
		}

		return damage;
	}

	public async getGatheringSpeed(): Promise<number> {
		let gatheringSpeed = 0;
		for (const survivor of await this.getSurvivors()) {
			gatheringSpeed += survivor.gatheringSpeed;
		}

		return gatheringSpeed;
	}

	public async getCarryCapacity(): Promise<number> {
		let carryCapacity = 0;
		for (const survivor of await this.getSurvivors()) {
			carryCapacity += survivor.carryCapacity;
		}

		return carryCapacity;
	}

	public async getInventory(): Promise<Resource[]> {
		return this.inventoryProperty.getAll();
	}

	public async addResource(
		amount: number,
		type: ResourceType
	): Promise<void> {
		await this.inventoryProperty.addResource(amount, type);
	}

	public async getResources(): Promise<Resource[]> {
		return this.inventoryProperty.getAll();
	}

	public deleteResource(id: ResourceId): void {
		this.inventoryProperty.remove(id);
	}

	async transferSurvivorTo(
		survivor: Survivor,
		newContainer: SurvivorContainer
	) {
		await this.survivorsProperty.transferSurvivorTo(survivor, newContainer);
	}
}
