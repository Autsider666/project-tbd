import { Client } from '../controller/ClientController.js';
import { ServerState } from '../ServerState.js';
import { Character } from './Character.js';
import { EntityClientData } from './Entity.js';
import { Event, EventId, EventStateData } from './Event.js';
import { Region } from './Region.js';

export type TravelEventStateData = {
	startPoint: Region;
	endpoint: Region;
} & EventStateData<Character>;

export type TravelEventClientData = TravelEventStateData &
	EntityClientData<EventId>;

export class TravelEvent extends Event<Character, TravelEventStateData> {
	public readonly startPoint: Region;
	public readonly endpoint: Region;

	constructor(
		protected readonly serverState: ServerState,
		data: TravelEventStateData
	) {
		super(serverState, data);

		this.startPoint = data.startPoint;
		this.endpoint = data.endpoint;
	}

	toJSON(): TravelEventStateData {
		return {
			id: this.id,
			target: this.target,
			startTime: this.startTime,
			endTime: this.endTime,
			canBeStopped: this.canBeStopped,
			chainEvent: this.chainEvent,
			startPoint: this.startPoint,
			endpoint: this.endpoint,
		};
	}

	public override normalize(
		forClient?: Client | null
	): TravelEventClientData {
		return {
			entityType: this.getEntityType(),
			...this.toJSON(),
		};
	}
}
