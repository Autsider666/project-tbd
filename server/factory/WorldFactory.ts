import { delay, inject, injectable } from 'tsyringe';
import WorldTemplates, {
	SettlementTemplate,
	WorldTemplate,
} from '../config/WorldTemplates.js';
import { BorderType } from '../entity/Border.js';
import { Region, RegionType } from '../entity/Region.js';
import { World } from '../entity/World.js';
import { BorderRepository } from '../repository/BorderRepository.js';
import { RegionRepository } from '../repository/RegionRepository.js';
import { ResourceNodeRepository } from '../repository/ResourceNodeRepository.js';
import { SettlementRepository } from '../repository/SettlementRepository.js';
import { WorldRepository } from '../repository/WorldRepository.js';
import { ResourceNodeFactory } from './ResourceNodeFactory.js';

@injectable()
export class WorldFactory {
	constructor(
		@inject(delay(() => WorldRepository))
		private readonly worldRepository: Readonly<WorldRepository>,
		@inject(delay(() => RegionRepository))
		private readonly regionRepository: RegionRepository,
		@inject(delay(() => ResourceNodeRepository))
		private readonly nodeRepository: ResourceNodeRepository,
		@inject(delay(() => BorderRepository))
		private readonly borderRepository: BorderRepository,
		@inject(delay(() => SettlementRepository))
		private readonly settlementRepository: SettlementRepository,
		@inject(delay(() => ResourceNodeFactory))
		private readonly resourceNodeFactory: ResourceNodeFactory
	) {}

	async create(template: string = 'default'): Promise<World> {
		const worldTemplate = WorldTemplates[template] ?? null;
		if (worldTemplate === null) {
			throw new Error('World template with this name does not exist');
		}

		const world = await this.worldRepository.create({
			name: worldTemplate.name ?? template,
			regions: [],
		});

		await this.createRegionsAndBorders(worldTemplate, world, template);

		return world;
	}

	private async createRegionsAndBorders(
		worldTemplate: WorldTemplate,
		world: World,
		fallbackName: string
	): Promise<void> {
		const regions = new Map<string, Region>();
		const borders = new Map<
			string,
			{
				neighbour: Region;
				neighbourTemplateId: string;
				expectedType: BorderType;
			}[]
		>();
		for (const [regionId, regionTemplate] of Object.entries(
			worldTemplate.regions
		)) {
			const region = await this.regionRepository.create({
				name: regionTemplate.name ?? fallbackName,
				type: regionTemplate.type ?? RegionType.plain,
				dimensions: regionTemplate.dimensions,
				world: world.getId(),
			});

			await world.addRegion(region);

			await this.createSettlement(
				regionTemplate.settlement,
				region,
				fallbackName
			);

			regions.set(regionId, region);
			for (const [targetId, borderType] of Object.entries(
				regionTemplate.borders
			)) {
				if (targetId === regionId) {
					throw new Error(
						`Region ${regionId} references to itself as a neighbour.`
					);
				}

				let linkedBorders = borders.get(targetId) ?? [];

				linkedBorders.push({
					neighbour: region,
					neighbourTemplateId: regionId,
					expectedType: borderType,
				});

				borders.set(targetId, linkedBorders);
			}

			for (const nodeTemplate of regionTemplate.nodes) {
				await this.resourceNodeFactory.create(
					nodeTemplate.name ?? fallbackName,
					nodeTemplate.type,
					region
				);
			}
		}

		const createdBorders = new Map<string, BorderType>();
		for (const [templateId, region] of regions) {
			const linkedBorders = borders.get(templateId) ?? [];
			for (const {
				neighbourTemplateId,
				neighbour,
				expectedType,
			} of linkedBorders) {
				if (templateId === neighbourTemplateId) {
					throw new Error('Ah, I messed up'); //TODO remove
				}

				const compare = createdBorders.get(
					`${region.getId()}-${neighbour.getId()}`
				);
				if (compare) {
					if (compare !== expectedType) {
						throw new Error(
							`The following regions don't have a correct border config: ${templateId} - ${neighbourTemplateId}`
						);
					}
					return;
				}

				const border = await this.borderRepository.create({
					type: expectedType,
					regions: [],
				});

				border.addRegion(region);
				border.addRegion(neighbour);

				createdBorders.set(
					`${neighbour.getId()}-${region.getId()}`,
					expectedType
				);
			}
		}
	}

	private async createSettlement(
		template: SettlementTemplate | null | undefined,
		region: Region,
		fallbackName: string
	): Promise<void> {
		if (!template) {
			return;
		}

		const settlement = await this.settlementRepository.create({
			name: template.name ?? fallbackName,
			region: region.getId(),
		});

		await region.setSettlement(settlement);
	}
}
