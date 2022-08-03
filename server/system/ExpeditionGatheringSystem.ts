import { injectable } from 'tsyringe';
import { Expedition, ExpeditionPhase } from '../entity/Expedition.js';
import { ResourceType } from '../entity/Resource.js';
import {
	ClientNotifier,
	NotificationCategory,
} from '../helper/ClientNotifier.js';
import { getRandomItem } from '../helper/Randomizer.js';
import { ExpeditionRepository } from '../repository/ExpeditionRepository.js';
import { System } from './System.js';

@injectable()
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
		let resources = node.getResources();

		const gathered: { [key in ResourceType]: number } = {
			[ResourceType.iron]: 0,
			[ResourceType.wood]: 0,
			[ResourceType.stone]: 0,
		};

		let amountToGather = party.getGatheringSpeed();
		while (amountToGather > 0) {
			resources = resources.filter(
				(resource) => resource.getAmount() > 0
			);
			if (resources.length === 0) {
				break;
			}

			const randomResource = getRandomItem(resources, (resource) =>
				resource.getAmount()
			);
			const toTake = Math.min(amountToGather, randomResource.getAmount());
			party.addResource(toTake, randomResource.type);
			randomResource.removeAmount(toTake);
			amountToGather -= toTake;
			gathered[randomResource.type] += toTake;
		}

		ClientNotifier.info(
			`Party "${party.name}" has gathered: ${Object.entries(gathered)
				.filter(([type, value]) => value > 0)
				.map(([type, value]) => `${value} ${type}`)
				.join(', ')}`,
			expedition.getUpdateRoomName(),
			[NotificationCategory.expedition]
		);

		if (resources.length === 0) {
			expedition.setCurrentPhase(ExpeditionPhase.gather, this.now);
			ClientNotifier.info(
				`${node.name} seems to be completely depleted, so party "${party.name}" is going to head back soon.`,
				expedition.getUpdateRoomName(),
				[NotificationCategory.expedition]
			);
		}
	}
}
