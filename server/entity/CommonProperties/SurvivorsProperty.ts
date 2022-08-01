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

	public override async add(value: Survivor | SurvivorId) {
		await super.add(value);

		if (typeof value === 'string') {
			const resource = await this.repository.get(value as SurvivorId);
			if (resource === null) {
				throw new Error('Weird af');
			}

			resource.owner = this.owner;
		} else {
			(value as Survivor).owner = this.owner;
		}
	}

	async transferSurvivorTo(
		survivor: Survivor,
		newContainer: SurvivorContainer
	) {
		if (!this.has(survivor)) {
			return;
		}

		await this.remove(survivor.getId());
		newContainer.addSurvivor(survivor);
	}
}
