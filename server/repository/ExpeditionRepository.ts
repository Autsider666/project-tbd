import { Constructor } from 'type-fest';
import {
	Expedition,
	ExpeditionStateData,
	ExpeditionId,
} from '../entity/Expedition.js';
import { Repository } from './Repository.js';

export class ExpeditionRepository extends Repository<
	Expedition,
	ExpeditionId,
	ExpeditionStateData
> {
	protected entity(): Constructor<Expedition> {
		return Expedition;
	}
}
