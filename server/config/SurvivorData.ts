import { container } from 'tsyringe';
import { ServerConfig } from '../serverConfig.js';
import { ResourceNodeType } from './ResourceData.js';

export enum Survivor {
	Villager = 'Villager',
	Laborer = 'Laborer',
	LumberJack = 'LumberJack',
	Miner = 'Miner',
	Scout = 'Scout',
	Fighter = 'Fighter',
	Knight = 'Knight',
}

export enum SurvivorTree {
	Generic = 'Generic',
}

export enum SurvivorStat {
	hp = 'hp',
	travelSpeed = 'travelSpeed',
	damage = 'damage',
	defense = 'defense',
	carryCapacity = 'carryCapacity',
	gatheringSpeed = 'gatheringSpeed',
}

export type PartyBoost = {
	percentage: number;
	stat: SurvivorStat;
	type: ResourceNodeType | null;
};

export type StatsBlock = { [key in SurvivorStat]: number };

export type SurvivorData = {
	name: Survivor;
	tree: SurvivorTree;
	tier: number;
	stats: StatsBlock;
	upgrades: Survivor[];
	nextUpgradeCost: number;
	boost: PartyBoost | null;
};

const config = container.resolve(ServerConfig);
const tier1UpgradeCost = config.get('survivorUpgradeCost.1') as number;
const tier2UpgradeCost = config.get('survivorUpgradeCost.2') as number;
const tier3UpgradeCost = -1;

export const SurvivorDataMap: { [key in Survivor]: SurvivorData } = {
	[Survivor.Villager]: {
		name: Survivor.Villager,
		tree: SurvivorTree.Generic,
		tier: 1,
		stats: {
			[SurvivorStat.hp]: 50,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 10,
			[SurvivorStat.defense]: 2,
			[SurvivorStat.carryCapacity]: 250,
			[SurvivorStat.gatheringSpeed]: 5,
		},
		boost: null,
		upgrades: [Survivor.Laborer, Survivor.Scout],
		nextUpgradeCost: tier1UpgradeCost,
	},
	[Survivor.Laborer]: {
		name: Survivor.Laborer,
		tree: SurvivorTree.Generic,
		tier: 2,
		stats: {
			[SurvivorStat.hp]: 50,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 10,
			[SurvivorStat.defense]: 2,
			[SurvivorStat.carryCapacity]: 350,
			[SurvivorStat.gatheringSpeed]: 7,
		},
		boost: null,
		upgrades: [Survivor.LumberJack, Survivor.Miner],
		nextUpgradeCost: tier2UpgradeCost,
	},
	[Survivor.LumberJack]: {
		name: Survivor.LumberJack,
		tree: SurvivorTree.Generic,
		tier: 3,
		stats: {
			[SurvivorStat.hp]: 50,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 10,
			[SurvivorStat.defense]: 2,
			[SurvivorStat.carryCapacity]: 350,
			[SurvivorStat.gatheringSpeed]: 7,
		},
		boost: {
			percentage: 10,
			stat: SurvivorStat.gatheringSpeed,
			type: ResourceNodeType.Forest,
		},
		upgrades: [],
		nextUpgradeCost: tier3UpgradeCost,
	},
	[Survivor.Miner]: {
		name: Survivor.Miner,
		tree: SurvivorTree.Generic,
		tier: 3,
		stats: {
			[SurvivorStat.hp]: 50,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 10,
			[SurvivorStat.defense]: 2,
			[SurvivorStat.carryCapacity]: 350,
			[SurvivorStat.gatheringSpeed]: 7,
		},
		boost: {
			percentage: 10,
			stat: SurvivorStat.gatheringSpeed,
			type: ResourceNodeType.Mountain,
		},
		upgrades: [],
		nextUpgradeCost: tier3UpgradeCost,
	},
	[Survivor.Scout]: {
		name: Survivor.Scout,
		tree: SurvivorTree.Generic,
		tier: 2,
		stats: {
			[SurvivorStat.hp]: 75,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 15,
			[SurvivorStat.defense]: 5,
			[SurvivorStat.carryCapacity]: 200,
			[SurvivorStat.gatheringSpeed]: 4,
		},
		boost: null,
		upgrades: [Survivor.Fighter, Survivor.Knight],
		nextUpgradeCost: tier2UpgradeCost,
	},
	[Survivor.Fighter]: {
		name: Survivor.Fighter,
		tree: SurvivorTree.Generic,
		tier: 3,
		stats: {
			[SurvivorStat.hp]: 75,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 20,
			[SurvivorStat.defense]: 5,
			[SurvivorStat.carryCapacity]: 200,
			[SurvivorStat.gatheringSpeed]: 4,
		},
		boost: {
			percentage: 1,
			stat: SurvivorStat.damage,
			type: null,
		},
		upgrades: [],
		nextUpgradeCost: tier3UpgradeCost,
	},
	[Survivor.Knight]: {
		name: Survivor.Knight,
		tree: SurvivorTree.Generic,
		tier: 3,
		stats: {
			[SurvivorStat.hp]: 75,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 15,
			[SurvivorStat.defense]: 10,
			[SurvivorStat.carryCapacity]: 200,
			[SurvivorStat.gatheringSpeed]: 4,
		},
		boost: {
			percentage: 1,
			stat: SurvivorStat.defense,
			type: null,
		},
		upgrades: [],
		nextUpgradeCost: tier3UpgradeCost,
	},
};
