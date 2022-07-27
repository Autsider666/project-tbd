import { injectable } from 'tsyringe';
import { World } from '../entity/World.js';
import { WorldRepository } from '../repository/WorldRepository.js';

@injectable()
export class WorldFactory {
	constructor(private readonly worldRepository: WorldRepository) {}

	create(name: string): World {
		const world = this.worldRepository.create({
			name,
			regions: [],
		});

		return world;
	}
}
