import { Constructor } from 'type-fest';
import { World, WorldData, WorldId } from '../entity/World.js';
import { Repository } from './Repository.js';

export class WorldRepository extends Repository<World, WorldId, WorldData> {
	protected entity(): Constructor<World> {
		return World;
	}
}
