import { injectable } from 'tsyringe';
import { Survivor, SurvivorTree } from '../config/SurvivorData.js';

@injectable()
export class SurvivorFactory {
	public create(type: Survivor): Survivor {
		return type;
	}

	public randomCreate(tier: number, tree?: SurvivorTree): Survivor {
		return this.create(Survivor.Villager);
	}
}
