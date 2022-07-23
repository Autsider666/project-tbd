import { Constructor } from 'type-fest';
import { World, WorldStateData, WorldId } from '../entity/World.js';
import { Repository } from './Repository.js';

export class WorldRepository extends Repository<
	World,
	WorldId,
	WorldStateData
> {
	protected entity(): Constructor<World> {
		return World;
	}
}
