import { registry, singleton } from 'tsyringe';
import { Constructor } from 'type-fest';
import { Survivor, SurvivorId, SurvivorStateData } from '../entity/Survivor.js';
import { Repository } from './Repository.js';

@singleton()
@registry([{ token: 'Repository', useValue: SurvivorRepository }])
export class SurvivorRepository extends Repository<
	Survivor,
	SurvivorId,
	SurvivorStateData
> {
	protected entity(): Constructor<Survivor> {
		return Survivor;
	}
}
