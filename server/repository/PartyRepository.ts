import { type } from 'os';
import { Party, PartyId, PartyStateData } from '../entity/Party.js';
import { Settlement, SettlementId } from '../entity/Settlement.js';
import { Survivor } from '../entity/Survivor.js';
import { PartyFactory } from '../factory/PartyFactory.js';
import { ServerState } from '../ServerState.js';
import { Repository } from './Repository.js';
import { Constructor } from 'type-fest';
import { SurvivorRepository } from './SurvivorRepository.js';

export class PartyRepository extends Repository<
	Party,
	PartyId,
	PartyStateData
> {
	private readonly factory: PartyFactory;

	constructor(
		protected readonly serverState: ServerState,
		entities: PartyStateData[] = []
	) {
		super(serverState, entities);

		this.factory = new PartyFactory(
			this,
			serverState.getRepository(Survivor) as SurvivorRepository
		);
	}

	protected entity(): Constructor<Party> {
		return Party;
	}

	public createNew(
		name: string,
		settlement: Settlement | SettlementId
	): Party {
		if (typeof settlement === 'string') {
			settlement = this.serverState
				.getRepository(Settlement)
				.get(settlement) as Settlement;

			if (settlement === null) {
				throw new Error('Uhm... this should never happen');
			}
		}
		return this.factory.create(name, settlement as Settlement);
	}
}
