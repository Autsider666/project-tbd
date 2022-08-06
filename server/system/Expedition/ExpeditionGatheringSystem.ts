import { singleton } from 'tsyringe';
import { ResourceType } from '../../config/ResourceData.js';
import { Expedition, ExpeditionPhase } from '../../entity/Expedition.js';
import {
	ClientNotifier,
	NotificationCategory,
} from '../../helper/ClientNotifier.js';
import { getRandomItem } from '../../helper/Randomizer.js';
import { ExpeditionRepository } from '../../repository/ExpeditionRepository.js';
import { System } from '../System.js';

@singleton()
export class ExpeditionGatheringSystem implements System {
	private now: Date = new Date();

	constructor(private readonly expeditionRepository: ExpeditionRepository) {}

	tick(now: Date): void {
		this.now = now;

		const activeExpedition = this.expeditionRepository
			.getAll()
			.filter(
				(expedition) =>
					expedition.getCurrentPhase() !== ExpeditionPhase.finished
			);

		for (const expedition of activeExpedition) {
			this.handleGathering(expedition);
		}
	}

	private handleGathering(expedition: Expedition): void {
		if (expedition.getCurrentPhase() !== ExpeditionPhase.gather) {
			return;
		}

		const party = expedition.getParty();
		const node = expedition.getTarget();

		const gathered: { [key in ResourceType]: number } = {
			[ResourceType.iron]: 0,
			[ResourceType.wood]: 0,
			[ResourceType.stone]: 0,
		};

		let isEmpty = false;
		let amountToGather = party.getGatheringSpeed();
		while (amountToGather > 0) {
			let resources = node.getResources();
			if (
				Object.values(resources).reduce((sum, value) => sum + value) ===
				0
			) {
				isEmpty = true;
				break;
			}

			const [randomResourceType, randomResourceAmount] = getRandomItem(
				Object.entries(resources),
				([, amount]) => amount
			) as [ResourceType, number];
			const toTake = Math.min(amountToGather, randomResourceAmount);
			party.addResource(toTake, randomResourceType);
			node.removeResource(toTake, randomResourceType);
			amountToGather -= toTake;
			gathered[randomResourceType] += toTake;
		}

		ClientNotifier.info(
			`Party "${party.name}" has gathered: ${Object.entries(gathered)
				.filter(([type, value]) => value > 0)
				.map(([type, value]) => `${value} ${type}`)
				.join(', ')}`,
			expedition.getUpdateRoomName(),
			[NotificationCategory.expedition]
		);

		if (isEmpty) {
			expedition.setCurrentPhase(ExpeditionPhase.gather, this.now);
			ClientNotifier.info(
				`${node.name} seems to be completely depleted, so party "${party.name}" is going to head back soon.`,
				expedition.getUpdateRoomName(),
				[NotificationCategory.expedition]
			);
		}
	}
}
