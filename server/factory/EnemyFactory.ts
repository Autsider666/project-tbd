import { singleton } from 'tsyringe';
import { Enemy } from '../entity/CommonTypes/Combat.js';
import { World } from '../entity/World.js';

@singleton()
export class EnemyFactory {
	public create(
		enemy: Omit<Enemy, 'damageTaken'>,
		now: Date,
		world: World
	): Enemy {
		const createdAt = world.createdAt;
		const worldAge = Math.floor(
			(now.getTime() -
				(typeof createdAt === 'object'
					? createdAt
					: new Date(createdAt)
				).getTime()) /
				(60000 * 60)
		);

		return {
			name: enemy.name,
			hp: Math.round(enemy.hp * Math.pow(1.5, worldAge)),
			damage: Math.round(enemy.damage * Math.pow(1.25, worldAge)),
			damageTaken: 0,
		};
	}
}
