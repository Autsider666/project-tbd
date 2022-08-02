import { injectable } from 'tsyringe';
import { SurvivorContainer } from '../entity/CommonTypes/SurvivorContainer.js';
import { Survivor, SurvivorStateData } from '../entity/Survivor.js';
import { SurvivorRepository } from '../repository/SurvivorRepository.js';

export enum SurvivorType {
	villager = 'villager',
}

enum SurvivorTree {
	generic = 'generic',
}

const survivorTemplates: {
	[key in SurvivorType]: Omit<SurvivorStateData, 'id' | 'party'>;
} = {
	villager: {
		name: SurvivorType.villager,
		hp: 50,
		damage: 10,
		carryCapacity: 50,
		gatheringSpeed: 1,
	},
};

@injectable()
export class SurvivorFactory {
	constructor(private readonly repository: SurvivorRepository) {}

	public create(type: SurvivorType, container: SurvivorContainer): Survivor {
		const survivor = this.repository.create({
			...survivorTemplates[type],
		});

		container.addSurvivor(survivor);

		return survivor;
	}

	public randomCreate(
		container: SurvivorContainer,
		tier: number,
		tree?: SurvivorTree
	): Survivor {
		return this.create(SurvivorType.villager, container);
	}
}
