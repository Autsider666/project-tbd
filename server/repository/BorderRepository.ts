import { Constructor } from 'type-fest';
import { Border, BorderStateData, BorderId } from '../entity/Border.js';
import { Repository } from './Repository.js';

export class BorderRepository extends Repository<
	Border,
	BorderId,
	BorderStateData
> {
	protected entity(): Constructor<Border> {
		return Border;
	}
}
