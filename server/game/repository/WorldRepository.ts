import onChange from 'on-change';
import { Constructor } from 'type-fest';
import { World, WorldData, WorldId } from '../entity/World.js';
import { Repository } from './Repository.js';

export class WorldRepository extends Repository<World, WorldId, WorldData> {
	private onChangeCallbacks: { (world: World): void }[] = [];

	protected entity(): Constructor<World> {
		return World;
	}

	protected override onCreate(entity: World): World {
		let index = 0;
		return onChange(
			entity,
			function (path, value, previousValue, applyData) {
				console.log('Object changed:', ++index);
				console.log('this:', this);
				console.log('path:', path);
				console.log('value:', value);
				console.log('previousValue:', previousValue);
				console.log('applyData:', applyData);
			}
		);
	}
}
