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
	boost: PartyBoost | null;
};

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
	},
};
