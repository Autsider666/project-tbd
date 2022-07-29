import { injectable } from 'tsyringe';
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
		private readonly worldRepository: WorldRepository,
		private readonly regionRepository: RegionRepository,
		private readonly nodeRepository: ResourceNodeRepository,
		private readonly borderRepository: BorderRepository,
		private readonly settlementRepository: SettlementRepository,
		private readonly resourceNodeFactory: ResourceNodeFactory
	) {}

	create(template: string = 'default'): World {
		const worldTemplate = WorldTemplates[template] ?? null;
		if (worldTemplate === null) {
			throw new Error('World template with this name does not exist');
		}

		const world = this.worldRepository.create({
			name: worldTemplate.name ?? template,
			regions: [],
		});

		this.createRegionsAndBorders(worldTemplate, world, template);

		return world;
	}

	private createRegionsAndBorders(
		worldTemplate: WorldTemplate,
		world: World,
		fallbackName: string
	): void {
		const regions = new Map<string, Region>();
		const borders = new Map<
			string,
			{
				neighbour: Region;
				neighbourTemplateId: string;
				expectedType: BorderType;
			}[]
		>();
		Object.entries(worldTemplate.regions).forEach(
			([regionId, regionTemplate]) => {
				const region = this.regionRepository.create({
					name: regionTemplate.name ?? fallbackName,
					type: regionTemplate.type ?? RegionType.plain,
					dimensions: regionTemplate.dimensions,
					world: world.getId(),
				});

				world.addRegion(region);

				this.createSettlement(
					regionTemplate.settlement,
					region,
					fallbackName
				);

				regions.set(regionId, region);
				Object.entries(regionTemplate.borders).forEach(
					([targetId, borderType]) => {
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
				);

				regionTemplate.nodes.forEach((nodeTemplate) => {
					this.resourceNodeFactory.create(
						nodeTemplate.name ?? fallbackName,
						nodeTemplate.type,
						region
					);
				});
			}
		);

		const createdBorders = new Map<string, BorderType>();
		regions.forEach((region, templateId) => {
			const linkedBorders = borders.get(templateId) ?? [];
			linkedBorders.forEach(
				({ neighbourTemplateId, neighbour, expectedType }) => {
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

					const border = this.borderRepository.create({
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
			);
		});
	}

	private createSettlement(
		template: SettlementTemplate | null | undefined,
		region: Region,
		fallbackName: string
	): void {
		if (!template) {
			return;
		}

		const settlement = this.settlementRepository.create({
			name: template.name ?? fallbackName,
			region: region.getId(),
		});

		region.setSettlement(settlement);
	}
}
