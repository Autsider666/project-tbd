import { injectable } from 'tsyringe';
import { ServerTickTime } from '../controller/ServerController.js';
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
export class ExpeditionSystem implements System {
	private now: Date = new Date();

	constructor(
		private readonly expeditionRepository: ExpeditionRepository,
		private readonly travelTimeCalculator: TravelTimeCalculator
	) {}

	async tick(now: Date): Promise<void> {
		this.now = now;

		const activeExpedition = (
			await this.expeditionRepository.getAll()
		).filter((expedition) => expedition.phase !== ExpeditionPhase.finished);

		for (const expedition of activeExpedition) {
			await this.handleGathering(expedition);
			await this.handlePhaseChange(expedition);
		}
	}

	private async handleGathering(expedition: Expedition) {
		if (expedition.phase !== ExpeditionPhase.gather) {
			return;
		}

		const party = await expedition.getParty();
		const node = await expedition.getTarget();
		let resources = await node.getResources();

		const gathered: { [key in ResourceType]: number } = {
			[ResourceType.iron]: 0,
			[ResourceType.wood]: 0,
			[ResourceType.stone]: 0,
		};

		let amountToGather = await party.getGatheringSpeed();
		while (amountToGather > 0) {
			resources = resources.filter(
				(resource) => resource.getAmount() > 0
			);
			if (resources.length === 0) {
				break;
			}

			const randomResource = this.getRandomResource(resources);
			const toTake = Math.min(amountToGather, randomResource.getAmount());
			await party.addResource(toTake, randomResource.type);
			randomResource.removeAmount(toTake);
			amountToGather -= toTake;
			gathered[randomResource.type] += toTake;
		}

		ClientNotifier.info(
			`${node.name} seems to be completely depleted, so party "${party.name}" is going to head back soon.`,
			await expedition.getUpdateRoomName()
		);

		ClientNotifier.info(
			`Party "${party.name}" has gathered: ${Object.entries(gathered)
				.filter(([type, value]) => value > 0)
				.map(([type, value]) => `${value} ${type}`)
				.join(', ')}`,
			await expedition.getUpdateRoomName(),
			[NotificationCategory.expedition]
		);

		if (resources.length === 0) {
			expedition.nextPhaseAt = new Date();
			ClientNotifier.info(
				`${node.name} seems to be completely depleted, so party "${party.name}" is going to head back soon.`,
				await expedition.getUpdateRoomName()
			);
		}
	}

	private getRandomResource(resources: Resource[]): Resource {
		const weights: number[] = [];
		for (let i = 0; i < resources.length; i++) {
			weights[i] = resources[i].getAmount() + (weights[i - 1] || 0);
		}

		const random = Math.random() * weights[weights.length - 1];
		for (let i = 0; i < weights.length; i++) {
			if (weights[i] > random) {
				return resources[i];
			}
		}

		throw new Error('Now this is interesting');
	}

	private async handlePhaseChange(expedition: Expedition) {
		if (expedition.nextPhaseAt >= this.now) {
			return;
		}

		switch (expedition.phase) {
			case ExpeditionPhase.gather:
				await this.handleEndOfGathering(expedition);
				break;
			case ExpeditionPhase.travel:
			case ExpeditionPhase.returning:
				await this.handleEndOfTravel(expedition);
				break;
			default:
				throw new Error('Should never happen'); //TODO
		}
	}

	private async handleEndOfGathering(expedition: Expedition) {
		expedition.phase = ExpeditionPhase.returning;

		const durationInSeconds =
			(
				await this.travelTimeCalculator.calculateTravelTime(
					await (await expedition.getOrigin()).getRegion(),
					await (await expedition.getTarget()).getRegion()
				)
			)?.cost ?? null;
		if (durationInSeconds === null) {
			throw new Error('Wait, no route between these two?');
		}

		expedition.nextPhaseAt = new Date(
			this.now.getTime() + durationInSeconds * 1000
		);

		const party = await expedition.getParty();
		const target = await expedition.getTarget();
		ClientNotifier.success(
			`Party "${party.name}" finished gathering at ${target.name} and are on their way back home.`,
			await party.getUpdateRoomName()
		);
	}

	private async handleEndOfTravel(expedition: Expedition): Promise<void> {
		const party = await expedition.getParty();
		const target = await expedition.getTarget();
		if (expedition.phase === ExpeditionPhase.returning) {
			party.setExpedition(null);
			expedition.phase = ExpeditionPhase.finished;

			ClientNotifier.success(
				`Party "${party.name}" returned from their expedition to ${target.name}.`,
				await party.getUpdateRoomName()
			);

			const settlement = await expedition.getOrigin();
			for (const item of await party.getInventory()) {
				await settlement.addResource(item.getAmount(), item.type);
				party.deleteResource(item.getId());
			}

			return;
		}

		expedition.phase = ExpeditionPhase.gather;

		const durationInSeconds =
			(await party.getCarryCapacity()) /
			(await party.getGatheringSpeed());
		expedition.nextPhaseAt = new Date(
			this.now.getTime() + durationInSeconds * ServerTickTime
		);

		ClientNotifier.success(
			`Party "${party.name}" arrived at ${target.name} and will start to gather.`,
			await party.getUpdateRoomName()
		);
	}
}
