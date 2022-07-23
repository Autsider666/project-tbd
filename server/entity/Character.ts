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

export type CharacterId = Opaque<Uuid, 'CharacterId'>;

export type CharacterStateData = {
	name: string;
	region: RegionId;
	currentTravelEvent: EventId | null;
} & EntityStateData<CharacterId>;

export type CharacterClientData = {
	controllable: boolean;
} & CharacterStateData &
	EntityClientData<CharacterId>;

export class Character extends Entity<
	CharacterId,
	CharacterStateData,
	CharacterClientData
> {
	public readonly name: string;
	private currentTravelEvent: EventId | TravelEvent | null;
	private regionProperty: RegionProperty;

	constructor(
		protected readonly serverState: ServerState,
		data: CharacterStateData
	) {
		super(serverState, data);

		this.name = data.name;
		this.regionProperty = new RegionProperty(serverState, data.region);
		this.currentTravelEvent = data.currentTravelEvent ?? null;
	}

	public toJSON(): CharacterStateData {
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

	public override normalize(forClient?: Client): CharacterClientData {
		return {
			entityType: this.constructor.name.toLowerCase(),
			controllable: forClient?.characters.has(this.id) ?? false,
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
