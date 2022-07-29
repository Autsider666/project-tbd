import { injectable } from 'tsyringe';
import { ServerTickTime } from '../controller/ServerController.js';
import { Expedition, ExpeditionPhase } from '../entity/Expedition.js';
import { Resource } from '../entity/Resource.js';
import { ClientNotifier } from '../helper/ClientNotifier.js';
import { TravelTimeCalculator } from '../helper/TravelTimeCalculator.js';
import { ExpeditionRepository } from '../repository/ExpeditionRepository.js';
import { System } from './System.js';

@injectable()
export class ExpeditionSystem implements System {
	constructor(
		private readonly expeditionRepository: ExpeditionRepository,
		private readonly travelTimeCalculator: TravelTimeCalculator
	) {}

	async tick(): Promise<void> {
		const now = new Date();

		const activeExpedition = this.expeditionRepository
			.getAll()
			.filter(
				(expedition) => expedition.phase !== ExpeditionPhase.finished
			);

		for (const expedition of activeExpedition) {
			this.handleGathering(expedition);
			this.handlePhaseChange(expedition, now);
		}
	}

	private handleGathering(expedition: Expedition): void {
		if (expedition.phase !== ExpeditionPhase.gather) {
			return;
		}

		const party = expedition.getParty();
		const node = expedition.getTarget();
		let resources = node.getResources();

		let amountToGather = party.getGatheringSpeed();
		while (amountToGather > 0) {
			resources = resources.filter(
				(resource) => resource.getAmount() > 0
			);
			if (resources.length === 0) {
				expedition.nextPhaseAt = new Date();
				ClientNotifier.info(
					`${node.name} seems to be completely depleted, so party "${party.name}" is going to head back soon.`,
					expedition.getUpdateRoomName()
				);
				break;
			}

			const randomResource = this.getRandomResource(resources);
			const toTake = Math.min(amountToGather, randomResource.getAmount());
			party.addResource(toTake, randomResource.type);
			randomResource.removeAmount(toTake);
			amountToGather -= toTake;
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

	private handlePhaseChange(expedition: Expedition, now: Date) {
		if (expedition.nextPhaseAt >= now) {
			return;
		}

		switch (expedition.phase) {
			case ExpeditionPhase.gather:
				this.handleEndOfGathering(expedition);
				break;
			case ExpeditionPhase.travel:
			case ExpeditionPhase.returning:
				this.handleEndOfTravel(expedition);
				break;
			default:
				throw new Error('Should never happen'); //TODO
		}
	}

	private handleEndOfGathering(expedition: Expedition): void {
		expedition.phase = ExpeditionPhase.returning;

		const durationInSeconds =
			this.travelTimeCalculator.calculateTravelTime(
				expedition.getOrigin().getRegion(),
				expedition.getTarget().getRegion()
			)?.cost ?? null;
		if (durationInSeconds === null) {
			throw new Error('Wait, no route between these two?');
		}

		const now = new Date();
		expedition.nextPhaseAt = new Date(
			now.getTime() + durationInSeconds * 1000
		);

		const party = expedition.getParty();
		const target = expedition.getTarget();
		ClientNotifier.success(
			`Party "${party.name}" finished gathering at ${target.name} and are on their way back home.`,
			party.getUpdateRoomName()
		);
	}

	private handleEndOfTravel(expedition: Expedition): void {
		const party = expedition.getParty();
		const target = expedition.getTarget();
		if (expedition.phase === ExpeditionPhase.returning) {
			party.setExpedition(null);
			expedition.phase = ExpeditionPhase.finished;

			ClientNotifier.success(
				`Party "${party.name}" returned from their expedition to ${target.name}.`,
				party.getUpdateRoomName()
			);

			const settlement = expedition.getOrigin();
			for (const item of party.getInventory()) {
				settlement.addResource(item.getAmount(), item.type);
				party.deleteResource(item.getId());
			}

			return;
		}

		expedition.phase = ExpeditionPhase.gather;

		const durationInSeconds =
			party.getCarryCapacity() / party.getGatheringSpeed();
		const now = new Date();
		expedition.nextPhaseAt = new Date(
			now.getTime() + durationInSeconds * ServerTickTime
		);

		ClientNotifier.success(
			`Party "${party.name}" arrived at ${target.name} and will start to gather.`,
			party.getUpdateRoomName()
		);
	}
}
