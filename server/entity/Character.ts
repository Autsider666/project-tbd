import { EntityUpdate } from '../controller/StateSyncController.js';
import { EventId } from './Event.js';
import { Region, RegionId } from './Region.js';
import { ServerState } from '../ServerState.js';
import { Opaque } from 'type-fest';
import { Entity } from './Entity.js';
import { TravelEvent } from './TravelEvent.js';

export type CharacterId = Opaque<number, 'CharacterId'>;
export type CharacterData = {
	id: CharacterId;
	entityType: string;
	name: string;
	region: RegionId;
	currentTravelEvent: EventId | null;
};

export class Character extends Entity<CharacterId, CharacterData> {
	public readonly name: string;
	private currentTravelEvent: EventId | TravelEvent | null;
	private region: Region | RegionId;

	constructor(
		protected readonly serverState: ServerState,
		data: CharacterData
	) {
		super(serverState, data);

		this.id = data.id;
		this.name = data.name;
		this.region = data.region;
		this.currentTravelEvent = data.currentTravelEvent ?? null;
	}

	normalize(): CharacterData {
		return {
			id: this.id,
			entityType: this.entityType,
			name: this.name,
			region:
				typeof this.region === 'number'
					? this.region
					: (this.region as Region).getId(),
			currentTravelEvent:
				typeof this.currentTravelEvent === 'number'
					? this.currentTravelEvent
					: (
							this.currentTravelEvent as TravelEvent | null
					  )?.getId() ?? null,
			// world: typeof this.world === "number" ? this.world as WorldId : (this.world as World).id,
		};
	}

	override prepareUpdate(updateObject: EntityUpdate = {}): EntityUpdate {
		const event = this.getCurrentTravelEvent();
		if (event !== null) {
			updateObject = event.prepareUpdate(updateObject);
		}

		return super.prepareUpdate(updateObject);
	}

	public getRegion(): Region {
		if (typeof this.region === 'number') {
			const repository = this.serverState.getRepository(Region);

			const region = repository.get(this.region as RegionId);
			if (region === null) {
				throw new Error('.... uhm.....');
			}

			this.region = region;
		}

		return this.region as Region;
	}

	public getCurrentTravelEvent(): TravelEvent | null {
		if (typeof this.currentTravelEvent === 'number') {
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
