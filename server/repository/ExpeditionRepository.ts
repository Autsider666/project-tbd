import { registry, singleton } from 'tsyringe';
import { Constructor } from 'type-fest';
import {
	Expedition,
	ExpeditionStateData,
	ExpeditionId,
} from '../entity/Expedition.js';
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
}
