import { singleton } from 'tsyringe';
import { PartyEnemies } from '../../config/EnemyData.js';
import { ResourceType } from '../../config/ResourceData.js';
import { Expedition, ExpeditionPhase } from '../../entity/Expedition.js';
import { EnemyFactory } from '../../factory/EnemyFactory.js';
import {
	ClientNotifier,
	NotificationCategory,
} from '../../helper/ClientNotifier.js';
import { getRandomItem } from '../../helper/Randomizer.js';
import { TravelTimeCalculator } from '../../helper/TravelTimeCalculator.js';
import { ExpeditionRepository } from '../../repository/ExpeditionRepository.js';
import { ServerConfig } from '../../serverConfig.js';
import { System } from '../System.js';

@singleton()
export class ExpeditionPhaseChangeSystem implements System {
	private now: Date = new Date();

	constructor(
		private readonly expeditionRepository: ExpeditionRepository,
		private readonly travelTimeCalculator: TravelTimeCalculator,
		private readonly config: ServerConfig,
		private readonly enemyFactory: EnemyFactory
	) {}

	tick(now: Date): void {
		this.now = now;

		const activeExpedition = this.expeditionRepository
			.getAll()
			.filter(
				(expedition) =>
					expedition.getCurrentPhase() !== ExpeditionPhase.finished &&
					expedition.getCurrentPhase() !== ExpeditionPhase.combat
			);

		for (const expedition of activeExpedition) {
			const currentPhaseEndsAt = expedition.getCurrentPhaseEndsAt();
			if (
				!currentPhaseEndsAt ||
				new Date(currentPhaseEndsAt) >= this.now
			) {
				this.checkForCombat(expedition);
				return;
			}

			switch (expedition.getCurrentPhase()) {
				case ExpeditionPhase.gather:
					this.handleEndOfGathering(expedition);
					break;
				case ExpeditionPhase.travel:
				case ExpeditionPhase.returning:
					this.handleEndOfTravel(expedition);
					break;
				default:
					throw new Error(
						'Should never happen:' + expedition.getCurrentPhase()
					); //TODO
			}
		}
	}

	private handleEndOfGathering(expedition: Expedition): void {
		const durationInSeconds =
			this.travelTimeCalculator.calculateTravelTime(
				expedition.getOrigin().getRegion(),
				expedition.getTarget().getRegion()
			)?.cost ?? null;
		if (durationInSeconds === null) {
			throw new Error('Wait, no route between these two?');
		}

		expedition.setCurrentPhase(
			ExpeditionPhase.returning,
			this.now,
			new Date(this.now.getTime() + durationInSeconds * 1000)
		);

		const party = expedition.getParty();
		const target = expedition.getTarget();
		ClientNotifier.success(
			`Party "${party.name}" finished gathering at ${target.name} and are on their way back home.`,
			party.getUpdateRoomName(),
			[NotificationCategory.expedition]
		);
	}

	private handleEndOfTravel(expedition: Expedition): void {
		const party = expedition.getParty();
		const target = expedition.getTarget();
		if (expedition.getCurrentPhase() === ExpeditionPhase.returning) {
			party.setExpedition(null);
			expedition.setCurrentPhase(ExpeditionPhase.finished, this.now);

			ClientNotifier.success(
				`Party "${party.name}" returned from their expedition to ${target.name}.`,
				party.getUpdateRoomName(),
				[NotificationCategory.general, NotificationCategory.expedition]
			);

			const settlement = expedition.getOrigin();
			for (const [type, amount] of Object.entries(party.getResources())) {
				// TODO test/find better solution
				settlement.addResource(amount as number, type as ResourceType);
				party.removeResource(amount as number, type as ResourceType);
			}

			return;
		}

		const durationInSeconds =
			party.getCarryCapacity() / party.getGatheringSpeed();
		expedition.setCurrentPhase(
			ExpeditionPhase.gather,
			this.now,
			new Date(
				this.now.getTime() +
					durationInSeconds * this.config.get('serverTickTime')
			)
		);

		ClientNotifier.success(
			`Party "${party.name}" arrived at ${target.name} and will start to gather.`,
			party.getUpdateRoomName(),
			[NotificationCategory.expedition]
		);
	}

	private checkForCombat(expedition: Expedition): void {
		if (expedition.previousPhase === ExpeditionPhase.combat) {
			const previous = expedition.previousPhaseEndedAt;
			if (previous === null) {
				throw new Error('Should not be null right now');
			}
			const secondsInPast =
				new Date(previous).getTime() - this.now.getTime() / 1000;
			if (
				secondsInPast <
				this.config.get('secondsBetweenCombatInSamePhase')
			) {
				return;
			}
		}

		const encountersEnemy =
			Math.floor(Math.random() * 101) <=
			this.config.get('expeditionCombatChance');
		if (!encountersEnemy) {
			return;
		}

		const party = expedition.getParty();
		expedition.enemy = this.enemyFactory.create(
			getRandomItem(PartyEnemies),
			this.now,
			party.getSettlement().getRegion().getWorld()
		);

		expedition.setCurrentPhase(ExpeditionPhase.combat, this.now, null);

		ClientNotifier.warning(
			`Party "${party.name}" has encountered an enemy and is now fighting with it.`,
			party.getUpdateRoomName(),
			[NotificationCategory.expedition, NotificationCategory.combat]
		);
	}
}
