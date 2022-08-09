import { Enemy } from '../entity/CommonTypes/Combat.js';

export const PartyEnemies: Omit<Enemy, 'damageTaken'>[] = [
	{
		name: 'Zombie',
		hp: 500,
		damage: 10,
	},
];

export const SettlementEnemies: Omit<Enemy, 'damageTaken'>[] = [
	{
		name: 'a horde of 42 zombies',
		hp: 1000,
		damage: 50,
	},
];
