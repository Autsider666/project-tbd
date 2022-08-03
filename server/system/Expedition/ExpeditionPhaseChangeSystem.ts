import { singleton } from 'tsyringe';
import { Expedition, ExpeditionPhase } from '../../entity/Expedition.js';
import {
	ClientNotifier,
	NotificationCategory,
} from '../../helper/ClientNotifier.js';
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
		private readonly config: ServerConfig
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
			if (!currentPhaseEndsAt || currentPhaseEndsAt >= this.now) {
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
			for (const item of party.getInventory()) {
				settlement.addResource(item.getAmount(), item.type);
				party.deleteResource(item.getId());
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
				console.log(expedition);
				throw new Error('Should not be null right now');
			}
			const secondsInPast =
				previous.getTime() - this.now.getTime() / 1000;
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

		expedition.enemy = {
			name: 'Zombie',
			hp: 500,
			damageTaken: 0,
			damage: 10,
		};

		expedition.setCurrentPhase(ExpeditionPhase.combat, this.now, null);

		const party = expedition.getParty();
		ClientNotifier.warning(
			`Party "${party.name}" has encountered an enemy and is now fighting with it.`,
			party.getUpdateRoomName(),
			[NotificationCategory.expedition, NotificationCategory.combat]
		);
	}
}
