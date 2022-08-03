import { singleton } from 'tsyringe';
import { Settlement } from '../../entity/Settlement.js';
import {
	ClientNotifier,
	NotificationCategory,
} from '../../helper/ClientNotifier.js';
import { SettlementRepository } from '../../repository/SettlementRepository.js';
import { ServerConfig } from '../../serverConfig.js';
import { System } from '../System.js';

@singleton()
export class SettlementCombatSystem implements System {
	private now: Date = new Date();

	constructor(
		private readonly settlementRepository: SettlementRepository,
		private readonly config: ServerConfig
	) {}

	tick(now: Date): void {
		this.now = now;

		for (const settlement of this.settlementRepository
			.getAll()
			.filter((settlement) => !settlement.destroyed)) {
			if (settlement.raid === null) {
				this.checkForRaid(settlement);
			} else {
				this.handleRaid(settlement);
			}
		}
	}

	private checkForRaid(settlement: Settlement): void {
		const encountersEnemy =
			Math.floor(Math.random() * 101) <=
			this.config.get('settlementRaidChance');
		if (!encountersEnemy) {
			return;
		}

		settlement.raid = {
			name: 'a horde of 42 zombies',
			hp: 1000,
			damage: 50,
			damageTaken: 0,
		};

		ClientNotifier.warning(
			`Settlement "${settlement.name}" is under attack by ${settlement.raid.name}!`,
			settlement.getUpdateRoomName()
		);
	}

	private handleRaid(settlement: Settlement): void {
		const raid = settlement.raid;
		if (raid === null) {
			throw new Error('Enemy should never be null.');
		}

		//Enemy attacks
		const damageTaken = raid.damage;
		settlement.damageTaken += damageTaken;
		ClientNotifier.info(
			`Settlement "${settlement.name}" has taken ${damageTaken} damage from ${raid.name}.`,
			settlement.getUpdateRoomName(),
			[NotificationCategory.combat]
		);

		if (settlement.hp < settlement.damageTaken) {
			ClientNotifier.warning(
				`Settlement "${settlement.name}" has been destroyed by ${raid.name}`,
				settlement.getUpdateRoomName(),
				[NotificationCategory.general, NotificationCategory.combat]
			);

			settlement.destroy();
			settlement.raid = null;
			return;
		}

		//Settlement attacks
		const damageDealt = settlement.damage;
		raid.damageTaken += damageDealt;

		ClientNotifier.info(
			`Settlement "${settlement.name}" has attacked ${raid.name} for ${damageDealt} damage.`,
			settlement.getUpdateRoomName(),
			[NotificationCategory.combat]
		);
		if (raid.damageTaken >= raid.hp) {
			ClientNotifier.success(
				`Settlement "${settlement.name}" has defeated ${raid.name}.`,
				settlement.getUpdateRoomName(),
				[NotificationCategory.combat]
			);
		}
	}
}
