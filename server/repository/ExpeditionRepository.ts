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

	public async getAllByParty(id: PartyId): Promise<Expedition[]> {
		const expeditions: Expedition[] = [];
		for (const expedition of await this.getAll()) {
			if ((await expedition.getParty()).getId() !== id) {
				continue;
			}

			expeditions.push(expedition);
		}

		return expeditions;
	}
}
