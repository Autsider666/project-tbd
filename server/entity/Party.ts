import { Opaque } from 'type-fest';
import { ResourceType } from '../config/ResourceData.js';
import {
	PartyBoost,
	StatsBlock,
	Survivor,
	SurvivorData,
	SurvivorDataMap,
	SurvivorStat,
} from '../config/SurvivorData.js';
import { Client } from '../controller/ClientController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { ExpeditionProperty } from './CommonProperties/ExpedtionProperty.js';
import { SettlementProperty } from './CommonProperties/SettlementProperty.js';
import { VoyageProperty } from './CommonProperties/VoyageProperty.js';
import {
	generateEmptyResourcesObject,
	ResourceContainer,
	Resources,
} from './CommonTypes/ResourceContainer.js';
import { SurvivorContainer } from './CommonTypes/SurvivorContainer.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { Expedition, ExpeditionId, ExpeditionPhase } from './Expedition.js';
import { Settlement, SettlementId } from './Settlement.js';
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
	energy?: number;
} & EntityStateData<PartyId>;

export type PartyClientData = Omit<PartyStateData, 'survivors'> & {
	controllable: boolean;
	stats: StatsBlock;
	boosts: PartyBoost[];
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
	public energy: number;

	private cachedBoosts: PartyBoost[] | null = null;

	constructor(data: PartyStateData) {
		super(data);

		this.name = data.name;
		this.dead = data.dead ?? false;
		this.settlementProperty = new SettlementProperty(data.settlement);
		this.survivors = data.survivors ?? [];
		this.resources = data.resources ?? generateEmptyResourcesObject();
		this.energy = data.energy ?? 0;
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
			resources: { ...generateEmptyResourcesObject(), ...this.resources },
			currentVoyage: this.voyageProperty?.toJSON() ?? null,
			currentExpedition: this.expeditionProperty?.toJSON() ?? null,
			energy: this.energy,
		};
	}

	getUpdateRoomName(): string {
		return this.getSettlement().getUpdateRoomName();
	}

	public override normalize(forClient?: Client): PartyClientData {
		return {
			entityType: this.constructor.name.toLowerCase(),
			controllable: forClient?.parties.has(this.id) ?? false,
			stats: {
				hp: this.getHp(),
				damage: this.getDamage(),
				gatheringSpeed: this.getGatheringSpeed(),
				carryCapacity: this.getCarryCapacity(),
				defense: this.getDefense(),
				travelSpeed: this.getTravelSpeed(),
			},
			boosts: this.getBoosts(),
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
		this.cachedBoosts = null;
	}

	public removeSurvivor(survivor: Survivor): boolean {
		const index = this.survivors.findIndex(
			(partyMember) => partyMember === survivor
		);
		if (index === -1) {
			return false;
		}

		this.survivors.splice(index, 1);
		this.cachedBoosts = null;

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

	public getBoosts(): PartyBoost[] {
		if (this.cachedBoosts === null) {
			return this.calculateBoosts();
		}

		return this.cachedBoosts;
	}

	private calculateBoosts(): PartyBoost[] {
		const boosts: PartyBoost[] = [];
		for (const survivorType of this.getSurvivors()) {
			const survivor = SurvivorDataMap[survivorType];
			const survivorBoost = survivor.boost;
			if (survivorBoost === null) {
				continue;
			}

			let applicableBoost: PartyBoost | null = null;
			for (const boost of boosts) {
				if (
					survivorBoost.stat !== boost.stat ||
					survivorBoost.type !== boost.type
				) {
					continue;
				}

				applicableBoost = boost;

				break;
			}

			if (applicableBoost === null) {
				boosts.push({ ...survivorBoost });
				continue;
			}

			applicableBoost.percentage += survivorBoost.percentage;
		}

		this.cachedBoosts = boosts;
		return boosts;
	}

	public getBoost(stat: SurvivorStat): PartyBoost | null {
		if (this.cachedBoosts === null) {
			this.cachedBoosts = this.calculateBoosts();
		}
		const expedition = this.expeditionProperty?.get();
		const currentType =
			expedition?.getCurrentPhase() === ExpeditionPhase.gather
				? expedition.getTarget().type
				: null;
		for (const boost of this.cachedBoosts) {
			if (boost.stat !== stat || boost.type !== currentType) {
				continue;
			}

			return boost;
		}

		return null;
	}

	public getHp(): number {
		return Math.round(this.getStat(SurvivorStat.hp));
	}

	public getDamage(): number {
		return Math.round(this.getStat(SurvivorStat.damage));
	}

	public getGatheringSpeed(): number {
		return Math.round(this.getStat(SurvivorStat.gatheringSpeed));
	}

	public getCarryCapacity(): number {
		return Math.round(this.getStat(SurvivorStat.carryCapacity));
	}

	public getDefense(): number {
		return Math.round(this.getStat(SurvivorStat.defense));
	}

	public getTravelSpeed(): number {
		return Math.round(
			this.getStat(SurvivorStat.travelSpeed) / this.getSurvivors().length
		);
	}

	private getStat(stat: SurvivorStat): number {
		let totalStat = 0;
		const survivors = this.getSurvivors();
		survivors.forEach(
			(survivor) => (totalStat += SurvivorDataMap[survivor].stats[stat])
		);

		return (
			totalStat * ((100 + (this.getBoost(stat)?.percentage ?? 0)) / 100)
		);
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
