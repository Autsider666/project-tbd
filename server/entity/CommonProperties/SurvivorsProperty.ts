import { SurvivorRepository } from '../../repository/SurvivorRepository.js';
import { SurvivorContainer } from '../CommonTypes/SurvivorContainer.js';
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

	public add(value: Survivor | SurvivorId) {
		super.add(value);

		if (!this.owner) {
			return;
		}

		if (typeof value === 'string') {
			const resource = this.repository.get(value as SurvivorId);
			if (resource === null) {
				throw new Error('Weird af');
			}

			resource.owner = this.owner;
		} else {
			(value as Survivor).owner = this.owner;
		}
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
