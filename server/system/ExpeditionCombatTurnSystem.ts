import { injectable } from 'tsyringe';
import { ExpeditionPhase } from '../entity/Expedition.js';
import {
	ClientNotifier,
	NotificationCategory,
} from '../helper/ClientNotifier.js';
import { ExpeditionRepository } from '../repository/ExpeditionRepository.js';
import { System } from './System.js';

@injectable()
export class ExpeditionCombatTurnSystem implements System {
	private now: Date = new Date();

	constructor(private readonly expeditionRepository: ExpeditionRepository) {}

	async tick(now: Date): Promise<void> {
		this.now = now;
		const activeExpedition = this.expeditionRepository
			.getAll()
			.filter(
				(expedition) =>
					expedition.getCurrentPhase() === ExpeditionPhase.combat
			);
		for (const expedition of activeExpedition) {
			const enemy = expedition.enemy;
			if (enemy === null) {
				throw new Error('Enemy should never be null.');
			}

			const party = expedition.getParty();

			//Party attacks
			const damageDealt = party.getDamage();
			enemy.damageTaken += damageDealt;

			ClientNotifier.info(
				`Party "${party.name}" has attacked ${enemy.name} for ${damageDealt} damage.`,
				party.getUpdateRoomName(),
				[NotificationCategory.expedition]
			);
			if (enemy.damageTaken >= enemy.hp) {
				const previousPhase = expedition.previousPhase;
				const previousPhaseEndedAt = expedition.previousPhaseEndedAt;
				const startedAt = expedition.getCurrentPhaseStartedAt();
				if (!previousPhase || !previousPhaseEndedAt || !startedAt) {
					throw new Error(
						'This should not be able to be null right now....  ' +
							expedition.getId()
					);
				}

				const timeCombatHasTaken =
					this.now.getTime() - startedAt.getTime();
				expedition.setCurrentPhase(
					previousPhase,
					this.now,
					new Date(this.now.getTime() + timeCombatHasTaken)
				);
				ClientNotifier.success(
					`Party "${party.name}" has killed ${enemy.name} and continues its expedition.`,
					party.getUpdateRoomName(),
					[NotificationCategory.expedition]
				);
				continue;
			}

			//Enemy attacks
			const damageTaken = enemy.damage;
			expedition.damageTaken += damageTaken;
			ClientNotifier.info(
				`Party "${party.name}" has taken ${damageTaken} damage from ${enemy.name}.`,
				party.getUpdateRoomName(),
				[NotificationCategory.expedition]
			);
			if (expedition.damageTaken < party.getHp()) {
				continue;
			}

			party.dead = true;
			ClientNotifier.error(
				`Party "${party.name}" has died fighting a ${enemy.name}`,
				party.getUpdateRoomName(),
				[NotificationCategory.general, NotificationCategory.expedition]
			);

			expedition.setCurrentPhase(ExpeditionPhase.finished, this.now);
		}
	}
}
