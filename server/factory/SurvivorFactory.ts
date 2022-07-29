import { injectable } from 'tsyringe';
import { Party } from '../entity/Party.js';
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

	public create(type: SurvivorType, party?: Party): Survivor {
		return this.repository.create({
			party: party?.getId() ?? null,
			...survivorTemplates[type],
		});
	}
}
