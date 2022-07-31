import { SurvivorRepository } from '../../repository/SurvivorRepository.js';
import { SurvivorContainer } from '../CommonTypes/SurvivorContainer.js';
import { Entity } from '../Entity.js';
import { Survivor, SurvivorId } from '../Survivor.js';
import { MultiCommonProperty } from './MultiCommonProperty.js';

export class SurvivorsProperty extends MultiCommonProperty<
	SurvivorId,
	Survivor
> {
	constructor(
		survivors: SurvivorId[],
		private readonly owner: SurvivorContainer
	) {
		super(survivors, SurvivorRepository);
	}

	public add(value: Survivor) {
		super.add(value);

		value.owner = this.owner;
	}

	transferSurvivorTo(
		survivor: Survivor,
		newContainer: SurvivorContainer
	): void {
		if (!this.has(survivor)) {
			return;
		}

		this.remove(survivor.getId());
		newContainer.addSurvivor(survivor);
	}
}
