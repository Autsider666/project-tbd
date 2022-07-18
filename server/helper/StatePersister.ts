import { promises as fsPromises } from 'fs';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { AreaRepository } from '../repository/AreaRepository.js';
import { Area } from '../entity/Area.js';
import { Character } from '../entity/Character.js';
import { CharacterRepository } from '../repository/CharacterRepository.js';
import { World } from '../entity/World.js';
import { ServerState } from '../ServerState.js';
import { WorldRepository } from '../repository/WorldRepository.js';

const filename = '../../state.json';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class StatePersister {
	static async writeState(state: ServerState) {
		console.log('in', state);
		console.log(JSON.stringify(state));

		try {
			await fsPromises.writeFile(
				join(__dirname, filename),
				JSON.stringify(state),
				{
					flag: 'w',
				}
			);
		} catch (e) {
			console.error(e);
		}
	}

	static async readState(): Promise<ServerState> {
		const contents = await fsPromises.readFile(
			join(__dirname, filename),
			'utf-8'
		);

		const loadedState = JSON.parse(contents);
		const serverState = new ServerState();

		const worlds = new WorldRepository(
			serverState,
			loadedState.WorldRepository ?? []
		);
		serverState.registerRepository(World, worlds);

		const characters = new CharacterRepository(
			serverState,
			loadedState.CharacterRepository ?? []
		);
		serverState.registerRepository(Character, characters);

		const areas = new AreaRepository(
			serverState,
			loadedState.AreaRepository ?? []
		);
		serverState.registerRepository(Area, areas);

		return serverState;
	}
}
