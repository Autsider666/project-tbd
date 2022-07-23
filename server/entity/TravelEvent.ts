import { Client } from '../controller/ClientController.js';
import { ServerState } from '../ServerState.js';
import { Party } from './Party.js';
import { EntityClientData } from './Entity.js';
import { Event, EventId, EventStateData } from './Event.js';
import { Region } from './Region.js';

export type TravelEventStateData = {
	startPoint: Region;
	endpoint: Region;
} & EventStateData<Party>;

export type TravelEventClientData = TravelEventStateData &
	EntityClientData<EventId>;

export class TravelEvent extends Event<
	Party,
	TravelEventStateData,
	TravelEventClientData
> {
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
			startPoint: this.startPoint,
			endpoint: this.endpoint,
		};
	}

	public override normalize(forClient?: Client): TravelEventClientData {
		return {
			entityType: this.getEntityType(),
			...this.toJSON(),
		};
	}
}
