import { ServerState } from '../ServerState.js';
import { Character } from './Character.js';
import { Event, EventData } from './Event.js';
import { Region } from './Region.js';

export type TravelEventData = {
	startPoint: Region;
	endpoint: Region;
} & EventData<Character>;

export class TravelEvent extends Event<Character, TravelEventData> {
	public readonly startPoint: Region;
	public readonly endpoint: Region;

	constructor(
		protected readonly serverState: ServerState,
		data: TravelEventData
	) {
		super(serverState, data);

		this.startPoint = data.startPoint;
		this.endpoint = data.endpoint;
	}

	override normalize(): TravelEventData {
		return {
			id: this.id,
			entityType: this.entityType,
			target: this.target,
			startTime: this.startTime,
			endTime: this.endTime,
			canBeStopped: this.canBeStopped,
			chainEvent: this.chainEvent,
			startPoint: this.startPoint,
			endpoint: this.endpoint,
		};
	}
}
