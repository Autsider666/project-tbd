import { promises as fsPromises } from 'fs';
import path, { join } from 'path';
import { container } from 'tsyringe';
import { Constructor } from 'type-fest';
import { fileURLToPath } from 'url';
import { Repository } from '../repository/Repository.js';

const filename = '../../state.json';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class StatePersister {
	// static async writeState(state: ServerState) {
	// 	console.log(JSON.stringify(state));
	//
	// 	try {
	// 		await fsPromises.writeFile(
	// 			join(__dirname, filename),
	// 			JSON.stringify(state),
	// 			{
	// 				flag: 'w',
	// 			}
	// 		);
	// 	} catch (e) {
	// 		console.error(e);
	// 	}
	// }

	static async readState(): Promise<void> {
		const contents = await fsPromises.readFile(
			join(__dirname, filename),
			'utf-8'
		);

		const loadedState = JSON.parse(contents);

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
