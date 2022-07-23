import { Constructor } from 'type-fest';
import {
	Settlement,
	SettlementId,
	SettlementStateData,
} from '../entity/Settlement.js';
import { Repository } from './Repository.js';

export class SettlementRepository extends Repository<
	Settlement,
	SettlementId,
	SettlementStateData
> {
	protected entity(): Constructor<Settlement> {
		return Settlement;
	}
}
