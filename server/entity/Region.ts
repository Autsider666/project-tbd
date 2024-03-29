import { container } from 'tsyringe';
import { Client } from '../controller/ClientController.js';
import { EntityUpdate } from '../controller/StateSyncController.js';
import { HasTravelTime } from '../helper/TravelTimeCalculator.js';
import { Uuid } from '../helper/UuidHelper.js';
import { WorldRepository } from '../repository/WorldRepository.js';
import { Border, BorderId } from './Border.js';
import { BordersProperty } from './CommonProperties/BordersProperty.js';
import { ResourceNodesProperty } from './CommonProperties/ResourceNodesProperty.js';
import { SettlementProperty } from './CommonProperties/SettlementProperty.js';
import { ResourceNode, ResourceNodeId } from './ResourceNode.js';
import { Settlement, SettlementId } from './Settlement.js';
import { World, WorldId } from './World.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { Opaque } from 'type-fest';

export type RegionId = Opaque<Uuid, 'RegionId'>;

export type RegionStateData = {
	name: string;
	type: RegionType;
	dimensions: string;
	world: WorldId;
	borders?: BorderId[];
	settlement?: SettlementId | null;
	nodes?: ResourceNodeId[];
} & EntityStateData<RegionId>;

export type RegionClientData = {
	travelTime: number;
} & RegionStateData &
	EntityClientData<RegionId>;

export enum RegionType {
	plain = 'plain',
}

const BaseRegionTravelTimeMapping: {
	[key in RegionType]: number;
} = { [RegionType.plain]: 10 };

export class Region
	extends Entity<RegionId, RegionStateData, RegionClientData>
	implements HasTravelTime
{
	private readonly worldRepository: WorldRepository =
		container.resolve(WorldRepository);

	public name: string;
	private readonly dimensions: string;
	private borders: BordersProperty;
	private world: World | WorldId;
	public readonly type: RegionType;
	private settlementProperty: SettlementProperty | null;
	private resourceNodesProperty: ResourceNodesProperty;

	constructor(data: RegionStateData) {
		super(data);

		this.name = data.name;
		this.dimensions = data.dimensions;
		this.world = data.world;
		this.type = data.type ?? RegionType.plain;
		this.settlementProperty = data.settlement
			? new SettlementProperty(data.settlement)
			: null;

		this.borders = new BordersProperty(data.borders ?? []);

		this.resourceNodesProperty = new ResourceNodesProperty(
			data.nodes ?? []
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
			borders: this.borders.toJSON(),
			settlement: this.settlementProperty?.toJSON() ?? null,
			nodes: this.resourceNodesProperty.toJSON(),
		};
	}

	override getUpdateRoomName(): string {
		return this.getWorld().getUpdateRoomName();
	}

	public override normalize(forClient?: Client): RegionClientData {
		return {
			entityType: this.getEntityType(),
			travelTime: this.getTravelTime(),
			...this.toJSON(),
		};
	}

	async prepareNestedEntityUpdate(
		updateObject: EntityUpdate = {},
		forClient?: Client
	): Promise<EntityUpdate> {
		if (this.getEntityRoomName() in updateObject) {
			return updateObject;
		}

		for (const border of this.getBorders()) {
			updateObject = await border.prepareNestedEntityUpdate(
				updateObject,
				forClient
			);
		}

		for (const node of this.getResourceNodes()) {
			updateObject = await node.prepareNestedEntityUpdate(
				updateObject,
				forClient
			);
		}

		const settlement = this.getSettlement();
		if (settlement != null) {
			updateObject = await settlement.prepareNestedEntityUpdate(
				updateObject,
				forClient
			);
		}

		return super.prepareNestedEntityUpdate(updateObject, forClient);
	}

	public getWorld(): World {
		if (typeof this.world === 'string') {
			const world = this.worldRepository.get(this.world as WorldId);
			if (world === null) {
				throw new Error('.... uhm.....');
			}

			this.world = world;
		}

		return this.world as World;
	}

	public getBorders(): Border[] {
		return this.borders.getAll();
	}

	public addBorder(border: Border): void {
		if (this.borders.has(border)) {
			return;
		}

		this.borders.add(border);

		border.addRegion(this);
	}

	public getSettlement(): Settlement | null {
		return this.settlementProperty?.get() ?? null;
	}

	public setSettlement(settlement: Settlement): void {
		if (this.settlementProperty === null) {
			this.settlementProperty = new SettlementProperty(settlement);
			return;
		}

		this.settlementProperty.set(settlement);
	}

	public addResourceNode(node: ResourceNode): void {
		this.resourceNodesProperty.add(node);

		node.setRegion(this);
	}

	public getTravelTime(): number {
		return BaseRegionTravelTimeMapping[this.type];
	}

	getNextTravelDestinations(): HasTravelTime[] {
		return this.borders.getAll();
	}

	public getResourceNodes(): ResourceNode[] {
		return this.resourceNodesProperty.getAll();
	}
}
