import { Constructor } from 'type-fest';
import { Voyage, VoyageStateData, VoyageId } from '../entity/Voyage.js';
import { Repository } from './Repository.js';

export class VoyageRepository extends Repository<
	Voyage,
	VoyageId,
	VoyageStateData
> {
	protected entity(): Constructor<Voyage> {
		return Voyage;
	}
}
