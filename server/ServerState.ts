import { Entity } from './entity/Entity';
import { Constructor } from 'type-fest';
import { Repository } from './repository/Repository';

export class ServerState {
	private repositories = new Map<
		Constructor<Entity<any, any>>,
		Repository<any, any, any>
	>();

	registerRepository(
		name: Constructor<Entity<any, any>>,
		repository: Repository<any, any, any>
	): void {
		this.repositories.set(name, repository);
	}

	getRepository<T extends Entity<any, any>>(
		name: Constructor<T>
	): Repository<T, any, any> | null {
		return this.repositories.get(name) ?? null;
	}

	toJSON() {
		const json: { [key: string]: Repository<any, any, any> } = {};
		this.repositories.forEach((repository) => {
			json[repository.constructor.name as string] = repository;
		});

		return json;
	}
}
