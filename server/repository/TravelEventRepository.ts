import { Constructor } from 'type-fest';
import { EventId } from '../entity/Event.js';
import { TravelEvent, TravelEventStateData } from '../entity/TravelEvent.js';
import { Repository } from './Repository.js';

export class TravelEventRepository extends Repository<
	TravelEvent,
	EventId,
	TravelEventStateData
> {
	protected entity(): Constructor<TravelEvent> {
		return TravelEvent;
	}
}
