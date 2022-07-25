import { Client } from '../controller/ClientController.js';
import { EntityUpdate } from '../controller/StateSyncController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { SettlementProperty } from './CommonProperties/SettlementProperty.js';
import { SurvivorsProperty } from './CommonProperties/SurvivorsProperty.js';
import { EventId } from './Event.js';
import { Settlement, SettlementId } from './Settlement.js';
import { ServerState } from '../ServerState.js';
import { Opaque } from 'type-fest';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { Survivor, SurvivorId } from './Survivor.js';
import { TravelEvent } from './TravelEvent.js';

export type PartyId = Opaque<Uuid, 'PartyId'>;

export type PartyStateData = {
	name: string;
	settlement: SettlementId;
	currentTravelEvent: EventId | null;
	survivors: SurvivorId[];
} & EntityStateData<PartyId>;

export type PartyClientData = {
	controllable: boolean;
} & PartyStateData &
	EntityClientData<PartyId>;

export class Party extends Entity<PartyId, PartyStateData, PartyClientData> {
	public readonly name: string;
	private currentTravelEvent: EventId | TravelEvent | null;
	private readonly settlementProperty: SettlementProperty;
	private readonly survivorsProperty: SurvivorsProperty;

	constructor(
		protected readonly serverState: ServerState,
		data: PartyStateData
	) {
		super(serverState, data);

		this.name = data.name;
		this.currentTravelEvent = data.currentTravelEvent ?? null;
		this.settlementProperty = new SettlementProperty(
			serverState,
			data.settlement
		);
		this.survivorsProperty = new SurvivorsProperty(
			serverState,
			data.survivors
		);
	}

	public toJSON(): PartyStateData {
		return {
			id: this.id,
			name: this.name,
			settlement: this.settlementProperty.toJSON(),
			survivors: this.survivorsProperty.toJSON(),
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

		this.getSurvivors().forEach((party) => {
			updateObject = party.prepareUpdate(updateObject, forClient);
		});

		return super.prepareUpdate(updateObject, forClient);
	}

	public getSettlement(): Settlement {
		return this.settlementProperty.get();
	}

	public getSurvivors(): Survivor[] {
		return this.survivorsProperty.getAll();
	}

	public addSurvivor(survivor: Survivor): void {
		this.survivorsProperty.add(survivor);
		survivor.setParty(this);
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
