import { registry, singleton } from 'tsyringe';
import { Constructor } from 'type-fest';
import { World, WorldStateData, WorldId } from '../entity/World.js';
import { Repository } from './Repository.js';

@singleton()
@registry([{ token: 'Repository', useValue: WorldRepository }])
export class WorldRepository extends Repository<
	World,
	WorldId,
	WorldStateData
> {
	protected entity(): Constructor<World> {
		return World;
	}
}
