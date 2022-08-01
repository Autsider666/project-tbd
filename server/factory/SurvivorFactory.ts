import { injectable } from 'tsyringe';
import { SurvivorContainer } from '../entity/CommonTypes/SurvivorContainer.js';
import { Survivor, SurvivorStateData } from '../entity/Survivor.js';
import { SurvivorRepository } from '../repository/SurvivorRepository.js';

export enum SurvivorType {
	villager = 'villager',
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

	public async create(
		type: SurvivorType,
		container: SurvivorContainer
	): Promise<Survivor> {
		const survivor = await this.repository.create({
			...survivorTemplates[type],
		});

		await container.addSurvivor(survivor);

		return survivor;
	}
}
