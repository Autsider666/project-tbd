import { ResourceNodeType } from './ResourceData.js';

export enum Survivor {
	Peasant = 'Peasant',
	Villager = 'Villager',
	Scout = 'Scout',
	['Town Militia'] = 'Town Militia',
	Laborer = 'Laborer',
	Fighter = 'Fighter',
	MuleRider = 'MuleRider',
	Knight = 'Knight',
	Archer = 'Archer',
	LumberJack = 'LumberJack',
	Miner = 'Miner',
	Scavenger = 'Scavenger',
	Axeman = 'Axeman',
	Pikeman = 'Pikeman',
	Spearman = 'Spearman',
	Caravan = 'Caravan',
	['Knights Templar'] = 'Knights Templar',
	['Crossbow Man'] = 'Crossbow Man',
	Warrior = 'Warrior',
	['Zwei Hander'] = 'Zwei Hander',
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

const tier1UpgradeCost = 100;
const tier2UpgradeCost = 250;
const tier3UpgradeCost = 375;
const tier4UpgradeCost = 500;
const tier5UpgradeCost = -1;

export const SurvivorDataMap: { [key in Survivor]: SurvivorData } = {
	[Survivor.Peasant]: {
		name: Survivor.Peasant,
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
		upgrades: [Survivor.Villager, Survivor.Scout],
		nextUpgradeCost: tier1UpgradeCost,
		boost: null,
	},
	[Survivor.Villager]: {
		name: Survivor.Villager,
		tree: SurvivorTree.Generic,
		tier: 2,
		stats: {
			[SurvivorStat.hp]: 75,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 15,
			[SurvivorStat.defense]: 4,
			[SurvivorStat.carryCapacity]: 350,
			[SurvivorStat.gatheringSpeed]: 9,
		},
		boost: null,
		upgrades: [Survivor.Laborer, Survivor['Town Militia']],
		nextUpgradeCost: tier2UpgradeCost,
	},
	[Survivor.Scout]: {
		name: Survivor.Scout,
		tree: SurvivorTree.Generic,
		tier: 2,
		stats: {
			[SurvivorStat.hp]: 75,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 15,
			[SurvivorStat.defense]: 4,
			[SurvivorStat.carryCapacity]: 450,
			[SurvivorStat.gatheringSpeed]: 7,
		},
		boost: null,
		upgrades: [
			Survivor.Fighter,
			Survivor.MuleRider,
			Survivor.Knight,
			Survivor.Archer,
		],
		nextUpgradeCost: tier2UpgradeCost,
	},
	[Survivor['Town Militia']]: {
		name: Survivor['Town Militia'],
		tree: SurvivorTree.Generic,
		tier: 3,
		stats: {
			[SurvivorStat.hp]: 100,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 20,
			[SurvivorStat.defense]: 4,
			[SurvivorStat.carryCapacity]: 350,
			[SurvivorStat.gatheringSpeed]: 10,
		},
		upgrades: [Survivor.Warrior],
		nextUpgradeCost: tier3UpgradeCost,
		boost: null,
	},

	[Survivor.Laborer]: {
		name: Survivor.Laborer,
		tree: SurvivorTree.Generic,
		tier: 3,
		stats: {
			[SurvivorStat.hp]: 75,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 15,
			[SurvivorStat.defense]: 3,
			[SurvivorStat.carryCapacity]: 350,
			[SurvivorStat.gatheringSpeed]: 12,
		},
		boost: {
			percentage: 5,
			stat: SurvivorStat.gatheringSpeed,
			type: null,
		},
		upgrades: [Survivor.LumberJack, Survivor.Miner, Survivor.Scavenger],
		nextUpgradeCost: tier3UpgradeCost,
	},
	[Survivor.Fighter]: {
		name: Survivor.Fighter,
		tree: SurvivorTree.Generic,
		tier: 3,
		stats: {
			[SurvivorStat.hp]: 200,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 20,
			[SurvivorStat.defense]: 10,
			[SurvivorStat.carryCapacity]: 250,
			[SurvivorStat.gatheringSpeed]: 5,
		},
		boost: {
			percentage: 2.5,
			stat: SurvivorStat.hp,
			type: null,
		},
		upgrades: [Survivor.Axeman, Survivor.Pikeman, Survivor.Spearman],
		nextUpgradeCost: tier3UpgradeCost,
	},
	[Survivor.MuleRider]: {
		name: Survivor.MuleRider,
		tree: SurvivorTree.Generic,
		tier: 3,
		stats: {
			[SurvivorStat.hp]: 75,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 15,
			[SurvivorStat.defense]: 5,
			[SurvivorStat.carryCapacity]: 650,
			[SurvivorStat.gatheringSpeed]: 7,
		},
		upgrades: [Survivor.Caravan],
		nextUpgradeCost: tier3UpgradeCost,
		boost: {
			percentage: 5,
			stat: SurvivorStat.carryCapacity,
			type: null,
		},
	},
	[Survivor.Knight]: {
		name: Survivor.Knight,
		tree: SurvivorTree.Generic,
		tier: 3,
		stats: {
			[SurvivorStat.hp]: 100,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 20,
			[SurvivorStat.defense]: 15,
			[SurvivorStat.carryCapacity]: 400,
			[SurvivorStat.gatheringSpeed]: 6,
		},
		boost: {
			percentage: 2.5,
			stat: SurvivorStat.defense,
			type: null,
		},
		upgrades: [Survivor['Knights Templar']],
		nextUpgradeCost: tier3UpgradeCost,
	},
	[Survivor.Archer]: {
		name: Survivor.Archer,
		tree: SurvivorTree.Generic,
		tier: 3,
		stats: {
			[SurvivorStat.hp]: 100,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 30,
			[SurvivorStat.defense]: 5,
			[SurvivorStat.carryCapacity]: 400,
			[SurvivorStat.gatheringSpeed]: 6,
		},
		upgrades: [Survivor['Crossbow Man']],
		nextUpgradeCost: tier3UpgradeCost,
		boost: {
			percentage: 2.5,
			stat: SurvivorStat.damage,
			type: null,
		},
	},
	[Survivor.LumberJack]: {
		name: Survivor.LumberJack,
		tree: SurvivorTree.Generic,
		tier: 4,
		stats: {
			[SurvivorStat.hp]: 100,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 20,
			[SurvivorStat.defense]: 4,
			[SurvivorStat.carryCapacity]: 350,
			[SurvivorStat.gatheringSpeed]: 20,
		},
		boost: {
			percentage: 20,
			stat: SurvivorStat.gatheringSpeed,
			type: ResourceNodeType.Forest,
		},
		upgrades: [],
		nextUpgradeCost: tier3UpgradeCost,
	},
	[Survivor.Miner]: {
		name: Survivor.Miner,
		tree: SurvivorTree.Generic,
		tier: 4,
		stats: {
			[SurvivorStat.hp]: 100,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 20,
			[SurvivorStat.defense]: 4,
			[SurvivorStat.carryCapacity]: 350,
			[SurvivorStat.gatheringSpeed]: 20,
		},
		boost: {
			percentage: 20,
			stat: SurvivorStat.gatheringSpeed,
			type: ResourceNodeType.Mountain,
		},
		upgrades: [],
		nextUpgradeCost: tier3UpgradeCost,
	},
	[Survivor.Scavenger]: {
		name: Survivor.Scavenger,
		tree: SurvivorTree.Generic,
		tier: 4,
		stats: {
			[SurvivorStat.hp]: 100,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 15,
			[SurvivorStat.defense]: 4,
			[SurvivorStat.carryCapacity]: 350,
			[SurvivorStat.gatheringSpeed]: 16,
		},
		upgrades: [],
		nextUpgradeCost: tier4UpgradeCost,
		boost: {
			percentage: 10,
			stat: SurvivorStat.gatheringSpeed,
			type: null,
		},
	},
	[Survivor.Axeman]: {
		name: Survivor.Axeman,
		tree: SurvivorTree.Generic,
		tier: 4,
		stats: {
			[SurvivorStat.hp]: 400,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 20,
			[SurvivorStat.defense]: 10,
			[SurvivorStat.carryCapacity]: 250,
			[SurvivorStat.gatheringSpeed]: 5,
		},
		upgrades: [],
		nextUpgradeCost: tier4UpgradeCost,
		boost: {
			percentage: 5,
			stat: SurvivorStat.hp,
			type: null,
		},
	},
	[Survivor.Pikeman]: {
		name: Survivor.Pikeman,
		tree: SurvivorTree.Generic,
		tier: 4,
		stats: {
			[SurvivorStat.hp]: 200,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 40,
			[SurvivorStat.defense]: 10,
			[SurvivorStat.carryCapacity]: 250,
			[SurvivorStat.gatheringSpeed]: 5,
		},
		upgrades: [],
		nextUpgradeCost: tier4UpgradeCost,
		boost: {
			percentage: 5,
			stat: SurvivorStat.hp,
			type: null,
		},
	},
	[Survivor.Spearman]: {
		name: Survivor.Spearman,
		tree: SurvivorTree.Generic,
		tier: 4,
		stats: {
			[SurvivorStat.hp]: 200,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 20,
			[SurvivorStat.defense]: 20,
			[SurvivorStat.carryCapacity]: 250,
			[SurvivorStat.gatheringSpeed]: 5,
		},
		upgrades: [],
		nextUpgradeCost: tier4UpgradeCost,
		boost: {
			percentage: 5,
			stat: SurvivorStat.hp,
			type: null,
		},
	},
	[Survivor.Caravan]: {
		name: Survivor.Caravan,
		tree: SurvivorTree.Generic,
		tier: 4,
		stats: {
			[SurvivorStat.hp]: 100,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 10,
			[SurvivorStat.defense]: 2,
			[SurvivorStat.carryCapacity]: 1000,
			[SurvivorStat.gatheringSpeed]: 5,
		},
		upgrades: [],
		nextUpgradeCost: tier4UpgradeCost,
		boost: {
			percentage: 5,
			stat: SurvivorStat.carryCapacity,
			type: null,
		},
	},
	[Survivor['Knights Templar']]: {
		name: Survivor['Knights Templar'],
		tree: SurvivorTree.Generic,
		tier: 4,
		stats: {
			[SurvivorStat.hp]: 150,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 20,
			[SurvivorStat.defense]: 30,
			[SurvivorStat.carryCapacity]: 400,
			[SurvivorStat.gatheringSpeed]: 6,
		},
		upgrades: [],
		nextUpgradeCost: tier4UpgradeCost,
		boost: {
			percentage: 5,
			stat: SurvivorStat.defense,
			type: null,
		},
	},
	[Survivor['Crossbow Man']]: {
		name: Survivor['Crossbow Man'],
		tree: SurvivorTree.Generic,
		tier: 4,
		stats: {
			[SurvivorStat.hp]: 100,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 60,
			[SurvivorStat.defense]: 5,
			[SurvivorStat.carryCapacity]: 400,
			[SurvivorStat.gatheringSpeed]: 6,
		},
		upgrades: [],
		nextUpgradeCost: tier4UpgradeCost,
		boost: {
			percentage: 5,
			stat: SurvivorStat.damage,
			type: null,
		},
	},
	[Survivor.Warrior]: {
		name: Survivor.Warrior,
		tree: SurvivorTree.Generic,
		tier: 4,
		stats: {
			[SurvivorStat.hp]: 50,
			[SurvivorStat.travelSpeed]: 100,
			[SurvivorStat.damage]: 10,
			[SurvivorStat.defense]: 2,
			[SurvivorStat.carryCapacity]: 250,
			[SurvivorStat.gatheringSpeed]: 5,
		},
		upgrades: [Survivor['Zwei Hander']],
		nextUpgradeCost: tier4UpgradeCost,
		boost: null,
	},
	[Survivor['Zwei Hander']]: {
		name: Survivor['Zwei Hander'],
		tree: SurvivorTree.Generic,
		tier: 5,
		stats: {
			[SurvivorStat.hp]: 300,
			[SurvivorStat.travelSpeed]: 10,
			[SurvivorStat.damage]: 45,
			[SurvivorStat.defense]: 23,
			[SurvivorStat.carryCapacity]: 750,
			[SurvivorStat.gatheringSpeed]: 16,
		},
		upgrades: [],
		nextUpgradeCost: tier5UpgradeCost,
		boost: null,
	},
};
