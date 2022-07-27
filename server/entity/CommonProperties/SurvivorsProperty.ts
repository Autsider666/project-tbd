import { SurvivorRepository } from '../../repository/SurvivorRepository.js';
import { Survivor, SurvivorId } from '../Survivor.js';
import { MultiCommonProperty } from './MultiCommonProperty.js';

export class SurvivorsProperty extends MultiCommonProperty<
	SurvivorId,
	Survivor
> {
	constructor(survivors: SurvivorId[]) {
		super(survivors, SurvivorRepository);
	}
}
