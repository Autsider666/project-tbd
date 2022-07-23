import { Opaque } from 'type-fest';
import { Client } from '../controller/ClientController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { ServerState } from '../ServerState.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { Party, PartyId } from './Party.js';

export type SurvivorId = Opaque<Uuid,  'SurvivorId'>;

export type SurvivorStateData = {
	name: string;
	party: PartyId | null;
} & EntityStateData<SurvivorId>;

export type SurvivorClientDate = SurvivorStateData & EntityClientData<SurvivorId>;

export class Survivor extends Entity<SurvivorId, SurvivorStateData, SurvivorClientDate>{
	private readonly name: string;
	private party: PartyId | Party | null;

	constructor(
		protected readonly serverState: ServerState,
		data: SurvivorStateData
	) {
		super(serverState, data);

		this.name = data.name;
		this.party = data.party;
	}

	normalize(forClient: Client): SurvivorClientDate {
		return {
			entityType: this.getEntityType(),
			... this.toJSON(),
		};
	}

	toJSON(): SurvivorStateData {
		return {
			id: this.id,
			name: this.name,
			party: typeof this.party === 'string'
				? this.party
				: (this.party as Party)?.getId() ?? null,
		};
	}

}
