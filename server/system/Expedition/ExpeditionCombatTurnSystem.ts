import { singleton } from 'tsyringe';
import { ExpeditionPhase } from '../../entity/Expedition.js';
import {
	ClientNotifier,
	NotificationCategory,
} from '../../helper/ClientNotifier.js';
import { ExpeditionRepository } from '../../repository/ExpeditionRepository.js';
import { System } from '../System.js';

@singleton()
export class ExpeditionCombatTurnSystem implements System {
	private now: Date = new Date();

	constructor(private readonly expeditionRepository: ExpeditionRepository) {}

	tick(now: Date): void {
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
				[NotificationCategory.combat]
			);
			if (enemy.damageTaken >= enemy.hp) {
				const previousPhase = expedition.previousPhase;
				const previousPhaseEndedAt = expedition.previousPhaseEndedAt;
				const startedAtString = expedition.getCurrentPhaseStartedAt();
				const startedAt = startedAtString
					? new Date(startedAtString)
					: null;
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
				expedition.previousPhaseEndedAt = this.now.toString(); //TODO fix some day

				ClientNotifier.success(
					`Party "${party.name}" has killed ${enemy.name}.`,
					party.getUpdateRoomName(),
					[
						NotificationCategory.expedition,
						NotificationCategory.combat,
					]
				);
				continue;
			}

			//Enemy attacks
			let damageTaken = Math.max(
				0,
				enemy.damage - Math.sqrt(party.getDefense())
			);
			expedition.damageTaken += damageTaken;
			ClientNotifier.info(
				damageTaken > 0
					? `Party "${party.name}" has taken ${damageTaken} damage from ${enemy.name}.`
					: `Party "${party.name}" has completely negated all the damage from ${enemy.name}.`,
				party.getUpdateRoomName(),
				[NotificationCategory.combat]
			);
			if (expedition.damageTaken < party.getHp()) {
				continue;
			}

			party.destroyedAt = now.toString();
			ClientNotifier.warning(
				`Party "${party.name}" has died fighting a ${enemy.name}`,
				party.getUpdateRoomName(),
				[NotificationCategory.general, NotificationCategory.combat]
			);

			expedition.setCurrentPhase(ExpeditionPhase.finished, this.now);

			party.getSettlement().removeParty(party); //TODO are we sure?
		}
	}
}
