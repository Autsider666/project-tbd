import { Client } from '../controller/ClientController.js';
import { EntityUpdate } from '../controller/StateSyncController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { RegionProperty } from './CommonProperties/RegionProperty.js';
import { EventId } from './Event.js';
import { Region, RegionId } from './Region.js';
import { ServerState } from '../ServerState.js';
import { Opaque } from 'type-fest';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { TravelEvent } from './TravelEvent.js';

export type PartyId = Opaque<Uuid, 'PartyId'>;

export type PartyStateData = {
	name: string;
	region: RegionId;
	currentTravelEvent: EventId | null;
} & EntityStateData<PartyId>;

export type PartyClientData = {
	controllable: boolean;
} & PartyStateData &
	EntityClientData<PartyId>;

export class Party extends Entity<
	PartyId,
	PartyStateData,
	PartyClientData
> {
	public readonly name: string;
	private currentTravelEvent: EventId | TravelEvent | null;
	private regionProperty: RegionProperty;

	constructor(
		protected readonly serverState: ServerState,
		data: PartyStateData
	) {
		super(serverState, data);

		this.name = data.name;
		this.regionProperty = new RegionProperty(serverState, data.region);
		this.currentTravelEvent = data.currentTravelEvent ?? null;
	}

	public toJSON(): PartyStateData {
		return {
			id: this.id,
			name: this.name,
			region: this.regionProperty.toJSON(),
			currentTravelEvent:
				typeof this.currentTravelEvent === 'string'
					? this.currentTravelEvent
					: (
							this.currentTravelEvent as TravelEvent | null
					  )?.getId() ?? null,
		};
	}

	public override normalize(forClient?: Client): PartyClientData {
		return {
			entityType: this.constructor.name.toLowerCase(),
			controllable: forClient?.parties.has(this.id) ?? false,
			...this.toJSON(),
		};
	}

	public override prepareUpdate(
		updateObject: EntityUpdate = {},
		forClient?: Client
	): EntityUpdate {
		const event = this.getCurrentTravelEvent();
		if (event != null) {
			updateObject = event.prepareUpdate(updateObject, forClient);
		}

		return super.prepareUpdate(updateObject, forClient);
	}

	public getRegion(): Region {
		return this.regionProperty.getRegion();
	}

	public getCurrentTravelEvent(): TravelEvent | null {
		if (typeof this.currentTravelEvent === 'string') {
			const repository = this.serverState.getRepository(TravelEvent);

			const event = repository.get(this.currentTravelEvent as EventId);
			if (event === null) {
				throw new Error('.... uhm.....');
			}

			this.currentTravelEvent = event;
		}

		return this.currentTravelEvent as TravelEvent | null;
	}
}
