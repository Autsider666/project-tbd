import { Client } from '../controller/ClientController.js';
import { EntityUpdate } from '../controller/StateSyncController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { Border, BorderId } from './Border.js';
import { SettlementProperty } from './CommonProperties/SettlementProperty.js';
import { Settlement, SettlementId } from './Settlement.js';
import { World, WorldId } from './World.js';
import { ServerState } from '../ServerState.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { Opaque } from 'type-fest';

export type RegionId = Opaque<Uuid, 'RegionId'>;

export type RegionStateData = {
	name: string;
	borders: BorderId[];
	world: WorldId;
	type: RegionType;
	settlement: SettlementId | null;
} & EntityStateData<RegionId>;

export type RegionClientData = RegionStateData & EntityClientData<RegionId>;

export enum RegionType {
	plain = 'plain',
}

export class Region extends Entity<
	RegionId,
	RegionStateData,
	RegionClientData
> {
	name: string;
	private borders = new Map<BorderId, Border | null>();
	private world: World | WorldId;
	type: RegionType;
	private settlementProperty: SettlementProperty | null;

	constructor(
		protected readonly serverState: ServerState,
		data: RegionStateData
	) {
		super(serverState, data);

		this.name = data.name;
		this.world = data.world;
		this.type = data.type ?? RegionType.plain;
		this.settlementProperty = data.settlement
			? new SettlementProperty(serverState, data.settlement)
			: null;

		data.borders.forEach((id) => this.borders.set(id, null));
	}

	toJSON(): RegionStateData {
		return {
			id: this.id,
			name: this.name,
			type: this.type,
			borders: Array.from(this.borders.keys()),
			world:
				typeof this.world === 'string'
					? (this.world as WorldId)
					: (this.world as World).getId(),
			settlement: this.settlementProperty?.toJSON() ?? null,
		};
	}

	public override normalize(forClient?: Client): RegionClientData {
		return {
			entityType: this.getEntityType(),
			...this.toJSON(),
		};
	}

	override prepareUpdate(
		updateObject: EntityUpdate = {},
		forClient?: Client
	): EntityUpdate {
		this.getBorders().forEach(
			(border) =>
				(updateObject = border.prepareUpdate(updateObject, forClient))
		);

		const settlement = this.getSettlement();
		if (settlement != null) {
			updateObject = settlement.prepareUpdate(updateObject, forClient);
		}

		return super.prepareUpdate(updateObject, forClient);
	}

	public getWorld(): World {
		if (typeof this.world === 'string') {
			const repository = this.serverState.getRepository(World);

			const world = repository.get(this.world as WorldId);
			if (world === null) {
				throw new Error('.... uhm.....');
			}

			this.world = world;
		}

		return this.world as World;
	}

	public getBorders(): Border[] {
		this.borders.forEach((border, id) => {
			if (border != null) {
				return;
			}

			const lazyLoadedBorder = this.serverState
				.getRepository(Border)
				.get(id);
			if (lazyLoadedBorder === null) {
				throw new Error('.... uhm.....');
			}

			this.borders.set(id, lazyLoadedBorder);
		});

		return Array.from(this.borders.values()) as Border[];
	}

	public getSettlement(): Settlement | null {
		return this.settlementProperty?.getSettlement() ?? null;
	}
}
