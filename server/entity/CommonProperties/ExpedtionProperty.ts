import { ExpeditionRepository } from '../../repository/ExpeditionRepository.js';
import { Expedition, ExpeditionId } from '../Expedition.js';
import { SingleCommonProperty } from './SingleCommonProperty.js';

export class ExpeditionProperty extends SingleCommonProperty<
	ExpeditionId,
	Expedition
> {
	constructor(expedition: ExpeditionId | Expedition) {
		super(expedition, ExpeditionRepository);
	}
}
