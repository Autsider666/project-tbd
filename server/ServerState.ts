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
	): Repository<T, any, any> {
		const repository = this.repositories.get(name);
		if (!repository) {
			throw new Error(
				name + ' has no registered repository in ServerState.'
			);
		}

		return repository;
	}

	getAllRepositories(): Repository<any, any, any>[] {
		return Array.from(this.repositories.values());
	}

	toJSON() {
		const json: { [key: string]: Repository<any, any, any> } = {};
		this.repositories.forEach((repository) => {
			json[repository.constructor.name as string] = repository;
		});

		return json;
	}
}