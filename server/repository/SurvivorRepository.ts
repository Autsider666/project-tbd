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
	constructor() {
		super();

		setInterval(() => {
			for (const resource of Object.values(this.entities).filter(
				(resource) => !resource.owner
			)) {
				console.error('Survivor without owner found:', resource);
			}
		}, 60000);
	}

	protected entity(): Constructor<Survivor> {
		return Survivor;
	}
}
