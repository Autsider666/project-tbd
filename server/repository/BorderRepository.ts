import { registry, singleton } from 'tsyringe';
import { Constructor } from 'type-fest';
import { Border, BorderStateData, BorderId } from '../entity/Border.js';
import { Repository } from './Repository.js';

@registry([{ token: 'Repository', useValue: BorderRepository }])
@singleton()
export class BorderRepository extends Repository<
	Border,
	BorderId,
	BorderStateData
> {
	protected entity(): Constructor<Border> {
		return Border;
	}
}
