import { Client } from '../controller/ClientController.js';
import { EntityUpdate } from '../controller/StateSyncController.js';
import { Uuid } from '../helper/UuidHelper.js';
import { Border, BorderId } from './Border.js';
import { ResourceNodesProperty } from './CommonProperties/ResourceNodesProperty.js';
import { SettlementProperty } from './CommonProperties/SettlementProperty.js';
import { ResourceNodeId } from './ResourceNode.js';
import { Settlement, SettlementId } from './Settlement.js';
import { World, WorldId } from './World.js';
import { ServerState } from '../ServerState.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { Opaque } from 'type-fest';

export type RegionId = Opaque<Uuid, 'RegionId'>;

export type RegionStateData = {
	name: string;
	type: RegionType;
	dimensions: string;
	world: WorldId;
	borders: BorderId[];
	settlement: SettlementId | null;
	nodes: ResourceNodeId[];
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
	public readonly name: string;
	private readonly dimensions: string;
	private borders = new Map<BorderId, Border | null>();
	private world: World | WorldId;
	public readonly type: RegionType;
	private settlementProperty: SettlementProperty | null;
	private resourceNodesProperty: ResourceNodesProperty;

	constructor(
		protected readonly serverState: ServerState,
		data: RegionStateData
	) {
		super(serverState, data);

		this.name = data.name;
		this.dimensions = data.dimensions;
		this.world = data.world;
		this.type = data.type ?? RegionType.plain;
		this.settlementProperty = data.settlement
			? new SettlementProperty(serverState, data.settlement)
			: null;

		data.borders.forEach((id) => this.borders.set(id, null));

		this.resourceNodesProperty = new ResourceNodesProperty(
			serverState,
			data.nodes
		);
	}

	toJSON(): RegionStateData {
		return {
			id: this.id,
			name: this.name,
			type: this.type,
			dimensions: this.dimensions,
			world:
				typeof this.world === 'string'
					? (this.world as WorldId)
					: (this.world as World).getId(),
			borders: Array.from(this.borders.keys()),
			settlement: this.settlementProperty?.toJSON() ?? null,
			nodes: this.resourceNodesProperty.toJSON(),
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
		if (this.getEntityRoomName() in updateObject) {
			return updateObject;
		}

		const viableRegions: RegionId[] = [];
		forClient?.parties.forEach((party) => {
			viableRegions.push(party.getSettlement().getRegion().getId());
		});

		if (this.getId() in viableRegions || !forClient) {
			this.getBorders().forEach(
				(border) =>
					(updateObject = border.prepareUpdate(
						updateObject,
						forClient
					))
			);

			this.resourceNodesProperty
				.getAll()
				.forEach(
					(node) =>
						(updateObject = node.prepareUpdate(
							updateObject,
							forClient
						))
				);
		}

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
		return this.settlementProperty?.get() ?? null;
	}
}
