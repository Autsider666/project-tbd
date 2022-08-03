import { singleton } from 'tsyringe';
import { SurvivorFactory } from '../../factory/SurvivorFactory.js';
import { getRandomItem } from '../../helper/Randomizer.js';
import { ServerConfig } from '../../serverConfig.js';
import { ExpeditionPhase } from '../../entity/Expedition.js';
import { ClientNotifier } from '../../helper/ClientNotifier.js';
import { ExpeditionRepository } from '../../repository/ExpeditionRepository.js';
import { System } from '../System.js';

@singleton()
export class ExpeditionRecruitmentSystem implements System {
	private now: Date = new Date();

	constructor(
		private readonly expeditionRepository: ExpeditionRepository,
		private readonly config: ServerConfig,
		private readonly survivorFactory: SurvivorFactory
	) {}

	tick(now: Date): void {
		this.now = now;

		const chances = this.config.get('expeditionRecruitment');

		const activeExpedition = this.expeditionRepository
			.getAll()
			.filter(
				(expedition) =>
					expedition.getCurrentPhase() !== ExpeditionPhase.finished &&
					expedition.getCurrentPhase() !== ExpeditionPhase.combat
			);
		for (const expedition of activeExpedition) {
			const willRecruit =
				Math.floor(Math.random() * 101) <=
				this.config.get('expeditionRecruitmentChance');
			if (!willRecruit) {
				continue;
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
