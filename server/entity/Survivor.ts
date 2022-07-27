import { container } from 'tsyringe';
import { Opaque } from 'type-fest';
import { Client } from '../controller/ClientController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { PartyRepository } from '../repository/PartyRepository.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { Party, PartyId } from './Party.js';

export type SurvivorId = Opaque<Uuid, 'SurvivorId'>;

export type SurvivorStateData = {
	name: string;
	party: PartyId | null;
	hp: number;
	damage: number;
	carryCapacity: number;
} & EntityStateData<SurvivorId>;

export type SurvivorClientDate = SurvivorStateData &
	EntityClientData<SurvivorId>;

export class Survivor extends Entity<
	SurvivorId,
	SurvivorStateData,
	SurvivorClientDate
> {
	private readonly partyRepository: PartyRepository =
		container.resolve(PartyRepository);

	private readonly name: string;
	private party: PartyId | Party | null;
	public readonly hp: number;
	public readonly damage: number;
	public readonly carryCapacity: number;

	constructor(data: SurvivorStateData) {
		super(data);

		this.name = data.name;
		this.party = data.party ?? null;
		this.hp = data.hp;
		this.damage = data.hp;
		this.carryCapacity = data.carryCapacity;
	}

	public getParty(): Party | null {
		if (typeof this.party === 'string') {
			const party = this.partyRepository.get(this.party as PartyId);
			if (party === null) {
				throw new Error('.... uhm.....');
			}

			this.party = party;
		}

		return this.party as Party | null;
	}

	public setParty(party: Party): void {
		if (this.getParty()?.getId() === party.getId()) {
			return;
		}

		this.party = party;
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
			party:
				typeof this.party === 'string'
					? this.party
					: (this.party as Party)?.getId() ?? null,
		};
	}

	getUpdateRoomName(): string {
		return this.getParty()?.getEntityRoomName() ?? ''; //TODO add settlement?
	}
}
