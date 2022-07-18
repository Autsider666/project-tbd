import { Constructor } from 'type-fest';
import { Border, BorderData, BorderId } from '../entity/Border.js';
import { Repository } from './Repository.js';

export class BorderRepository extends Repository<Border, BorderId, BorderData> {
	protected entity(): Constructor<Border> {
		return Border;
	}
}
