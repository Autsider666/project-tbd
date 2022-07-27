import { injectable } from 'tsyringe';
import { Except } from 'type-fest';
import { Party, PartyId } from '../entity/Party.js';
import { Survivor, SurvivorStateData } from '../entity/Survivor.js';
import { SurvivorRepository } from '../repository/SurvivorRepository.js';

export enum SurvivorType {
	villager = 'villager',
}

const survivorTemplates: {
	[key: string]: Except<SurvivorStateData, 'id' | 'party'>;
} = {
	villager: {
		name: SurvivorType.villager,
		hp: 1,
		damage: 1,
		carryCapacity: 1,
	},
};

@injectable()
export class SurvivorFactory {
	constructor(private readonly repository: SurvivorRepository) {}

	public create(type: SurvivorType, party?: Party | PartyId): Survivor {
		return this.repository.create({
			party:
				typeof party === 'string'
					? party
					: (party as Party)?.getId() ?? null,
			...survivorTemplates[type],
		});
	}
}
