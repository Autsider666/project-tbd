import { Opaque } from 'type-fest';
import { Uuid } from '../helper/UuidHelper.js';
import { ServerState } from '../ServerState.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';

export type EventId = Opaque<Uuid, 'EventId'>;
export type EventStateData<T extends Entity<any, any, any>> = {
	target: T;
	startTime: Date;
	endTime: Date;
	canBeStopped: boolean;
} & EntityStateData<EventId>;

export type EventClientData<T extends Entity<any, any, any>> =
	EventStateData<T> & EntityClientData<EventId>;

export abstract class Event<
	T extends Entity<any, any, any>,
	TStateData extends EventStateData<T>,
	TClientData extends EventClientData<T>
> extends Entity<EventId, TStateData, TClientData> {
	public readonly target: T;
	public readonly startTime: Date;
	public readonly endTime: Date;
	public readonly canBeStopped: boolean;
	public readonly eventType: string;

	protected constructor(
		protected readonly serverState: ServerState,
		data: TStateData
	) {
		super(serverState, data);

		this.target = data.target;
		this.startTime = data.startTime;
		this.endTime = data.endTime;
		this.canBeStopped = data.canBeStopped;
		this.eventType = this.constructor.name;
	}
}
