import { registry, singleton } from 'tsyringe';
import { Constructor } from 'type-fest';
import { Voyage, VoyageStateData, VoyageId } from '../entity/Voyage.js';
import { Repository } from './Repository.js';

@singleton()
@registry([{ token: 'Repository', useValue: VoyageRepository }])
export class VoyageRepository extends Repository<
	Voyage,
	VoyageId,
	VoyageStateData
> {
	protected entity(): Constructor<Voyage> {
		return Voyage;
	}
}
