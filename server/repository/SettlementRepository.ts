import { registry, singleton } from 'tsyringe';
import { Constructor } from 'type-fest';
import {
	Settlement,
	SettlementId,
	SettlementStateData,
} from '../entity/Settlement.js';
import { Repository } from './Repository.js';

@singleton()
@registry([{ token: 'Repository', useValue: SettlementRepository }])
export class SettlementRepository extends Repository<
	Settlement,
	SettlementId,
	SettlementStateData
> {
	protected entity(): Constructor<Settlement> {
		return Settlement;
	}
}
