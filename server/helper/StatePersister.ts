import { promises as fsPromises } from 'fs';
import path, { join } from 'path';
import { container, injectable } from 'tsyringe';
import { Constructor } from 'type-fest';
import { fileURLToPath } from 'url';
import { Repository } from '../repository/Repository.js';

const filename = '../../state.json';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

injectable();
export class StatePersister {
	static async writeState() {
		let loadedState: { [key: string]: Repository<any, any, any> } = {};
		const repositories =
			container.resolveAll<Constructor<Repository<any, any, any>>>(
				'Repository'
			);
		repositories.forEach((identifier) => {
			const repository = container.resolve(identifier);
			loadedState[repository.constructor.name] = repository;
		});

		try {
			await fsPromises.writeFile(
				join(__dirname, filename),
				JSON.stringify(loadedState),
				{
					flag: 'w',
				}
			);
		} catch (e) {
			console.error(e);
		}
	}

	static async readState(): Promise<void> {
		let loadedState: { [key: string]: any[] } = {};
		try {
			const contents = await fsPromises.readFile(
				join(__dirname, filename),
				'utf-8'
			);

			loadedState = JSON.parse(contents);
		} catch (e) {
			console.log('No saved state found.');
		}

		const repositories =
			container.resolveAll<Constructor<Repository<any, any, any>>>(
				'Repository'
			);
		repositories.forEach((identifier) => {
			const repository = container.resolve(identifier);
			repository.load(loadedState[repository.constructor.name] ?? []);
		});
	}
}
