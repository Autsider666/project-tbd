import { injectable } from 'tsyringe';
import { SurvivorFactory } from '../factory/SurvivorFactory.js';
import { getRandomItem } from '../helper/Randomizer.js';
import { ServerConfig } from '../serverConfig.js';
import { Expedition, ExpeditionPhase } from '../entity/Expedition.js';
import { Resource, ResourceType } from '../entity/Resource.js';
import {
	ClientNotifier,
	NotificationCategory,
} from '../helper/ClientNotifier.js';
import { TravelTimeCalculator } from '../helper/TravelTimeCalculator.js';
import { ExpeditionRepository } from '../repository/ExpeditionRepository.js';
import { System } from './System.js';

@injectable()
export class ExpeditionRecruitmentSystem implements System {
	private now: Date = new Date();

	constructor(
		private readonly expeditionRepository: ExpeditionRepository,
		private readonly config: ServerConfig,
		private readonly survivorFactory: SurvivorFactory
	) {}

	async tick(now: Date): Promise<void> {
		this.now = now;

		const chances = this.config.get('expeditionRecruitment');

		const activeExpedition = this.expeditionRepository
			.getAll()
			.filter(
				(expedition) => expedition.phase !== ExpeditionPhase.finished
			);
		for (const expedition of activeExpedition) {
			const willRecruit =
				Math.floor(Math.random() * 101) <=
				this.config.get('expeditionRecruitmentChange');
			if (!willRecruit) {
				return;
			}

			const party = expedition.getParty();
			const tier = getRandomItem(
				Object.keys(chances),
				(change) => chances[change]
			);
			const survivor = this.survivorFactory.randomCreate(
				party,
				parseInt(tier)
			);

			ClientNotifier.success(
				`Party "${party.name}" managed to recruit survivor "${survivor.name}" during their expedition!`,
				party.getUpdateRoomName()
			);
		}
	}
}
