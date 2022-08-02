import { injectable } from 'tsyringe';
import { getRandomItem } from '../helper/Randomizer.js';
import { ServerConfig } from '../serverConfig.js';
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
export class ExpeditionPhaseSystem implements System {
	private now: Date = new Date();

	constructor(
		private readonly expeditionRepository: ExpeditionRepository,
		private readonly travelTimeCalculator: TravelTimeCalculator,
		private readonly config: ServerConfig
	) {}

	async tick(now: Date): Promise<void> {
		this.now = now;

		const activeExpedition = this.expeditionRepository
			.getAll()
			.filter(
				(expedition) => expedition.phase !== ExpeditionPhase.finished
			);

		for (const expedition of activeExpedition) {
			if (expedition.nextPhaseAt >= this.now) {
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

		expedition.nextPhaseAt = new Date(
			this.now.getTime() + durationInSeconds * 1000
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
		expedition.nextPhaseAt = new Date(
			this.now.getTime() +
				durationInSeconds * this.config.get('serverTickTime')
		);

		ClientNotifier.success(
			`Party "${party.name}" arrived at ${target.name} and will start to gather.`,
			party.getUpdateRoomName()
		);
	}
}
