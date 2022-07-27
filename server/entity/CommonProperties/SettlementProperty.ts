import { SettlementRepository } from '../../repository/SettlementRepository.js';
import { Settlement, SettlementId } from '../Settlement.js';
import { SingleCommonProperty } from './SingleCommonProperty.js';

export class SettlementProperty extends SingleCommonProperty<
	SettlementId,
	Settlement
> {
	constructor(settlement: SettlementId | Settlement) {
		super(settlement, SettlementRepository);
	}
}
