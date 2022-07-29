import { Opaque } from 'type-fest';
import { Client } from '../controller/ClientController.js';
import { HasTravelTime } from '../helper/TravelTimeCalculator.js';
import { Uuid } from '../helper/UuidHelper.js';
import { RegionsProperty } from './CommonProperties/RegionsProperty.js';
import { Region, RegionId } from './Region.js';
import { Entity, EntityClientData, EntityStateData } from './Entity.js';
import { World } from './World.js';

export type BorderId = Opaque<Uuid, 'BorderId'>;
export type BorderStateData = {
	regions: RegionId[];
	type: BorderType;
} & EntityStateData<BorderId>;

export type BorderClientData = {
	travelTime: number;
} & BorderStateData &
	EntityClientData<BorderId>;

export enum BorderType {
	default = 'default',
	mountain = 'mountain',
	water = 'water',
}

const BaseBorderTravelTimeMapping: {
	[key in BorderType]: number;
} = {
	[BorderType.default]: 10,
	[BorderType.mountain]: 60,
	[BorderType.water]: 30,
};

export class Border
	extends Entity<BorderId, BorderStateData, BorderClientData>
	implements HasTravelTime
{
	private regions: RegionsProperty;
	public readonly type: BorderType;

	constructor(data: BorderStateData) {
		super(data);

		this.id = data.id;
		this.type = data.type ?? BorderType.default;

		this.regions = new RegionsProperty(data.regions);
	}

	toJSON(): BorderStateData {
		return {
			id: this.id,
			type: this.type,
			regions: this.regions.toJSON(),
		};
	}

	getUpdateRoomName(): string {
		const regions = this.getRegions();
		if (regions.length === 0) {
			return '';
		}

		return this.getRegions()[0].getUpdateRoomName();
	}

	public override normalize(forClient?: Client): BorderClientData {
		return {
			entityType: this.getEntityType(),
			travelTime: this.getTravelTime(),
			...this.toJSON(),
		};
	}

	public getRegions(): Region[] {
		return this.regions.getAll();
	}

	public addRegion(region: Region): void {
		if (this.regions.has(region)) {
			return;
		}

		this.regions.add(region);

		region.addBorder(this);
	}

	public getTravelTime(): number {
		return BaseBorderTravelTimeMapping[this.type];
	}

	getNextTravelDestinations(): HasTravelTime[] {
		return this.regions.getAll();
	}

	getWorld(): World {
		const region = this.regions.getAll()[0] ?? null;
		if (region === null) {
			throw new Error("Can't get world id in a border without regions.");
		}

		return region.getWorld();
	}
}
