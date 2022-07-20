import { Opaque } from 'type-fest';
import { ServerState } from '../ServerState.js';
import { Entity, EntityData } from './Entity.js';

export type EventId = Opaque<number, 'EventId'>;
export type EventData<T extends Entity<any, any>> = {
	target: T;
	startTime: Date;
	endTime: Date;
	canBeStopped: boolean;
	chainEvent: Event<any, any> | null;
} & EntityData<EventId>;

export abstract class Event<
	T extends Entity<any, any>,
	TData extends EventData<T>
> extends Entity<EventId, TData> {
	public readonly target: T;
	public readonly startTime: Date;
	public readonly endTime: Date;
	public readonly canBeStopped: boolean;
	public readonly eventType: string;
	public readonly chainEvent: Event<any, any> | null;

	protected constructor(
		protected readonly serverState: ServerState,
		data: TData
	) {
		super(serverState, data);

		this.target = data.target;
		this.startTime = data.startTime;
		this.endTime = data.endTime;
		this.canBeStopped = data.canBeStopped;
		this.eventType = this.constructor.name;
		this.chainEvent = data.chainEvent;
	}
}
