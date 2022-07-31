import { registry, singleton } from 'tsyringe';
import { Constructor } from 'type-fest';
import {
	Expedition,
	ExpeditionStateData,
	ExpeditionId,
} from '../entity/Expedition.js';
import { PartyId } from '../entity/Party.js';
import { Repository } from './Repository.js';

@singleton()
@registry([{ token: 'Repository', useValue: ExpeditionRepository }])
export class ExpeditionRepository extends Repository<
	Expedition,
	ExpeditionId,
	ExpeditionStateData
> {
	protected entity(): Constructor<Expedition> {
		return Expedition;
	}

	public getAllByParty(id: PartyId): Expedition[] {
		return this.getAll().filter((expedition) => {
			return expedition.getParty().getId() === id;
		});
	}
}
