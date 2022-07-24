import { Constructor } from 'type-fest';
import { Party, PartyId } from '../entity/Party.js';
import { Survivor, SurvivorId, SurvivorStateData } from '../entity/Survivor.js';
import { SurvivorFactory, SurvivorType } from '../factory/SurvivorFactory.js';
import { ServerState } from '../ServerState.js';
import { Repository } from './Repository.js';

export class SurvivorRepository extends Repository<
	Survivor,
	SurvivorId,
	SurvivorStateData
> {
	private readonly factory: SurvivorFactory;

	constructor(
		protected readonly serverState: ServerState,
		entities: SurvivorStateData[] = []
	) {
		super(serverState, entities);

		this.factory = new SurvivorFactory(this);
	}

	protected entity(): Constructor<Survivor> {
		return Survivor;
	}

	public createType(type: SurvivorType, party?: Party | PartyId) {
		return this.factory.create(type, party);
	}
}
