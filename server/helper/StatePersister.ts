import { promises as fsPromises } from 'fs';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import { Border } from '../entity/Border.js';
import { RegionRepository } from '../repository/RegionRepository.js';
import { Region } from '../entity/Region.js';
import { Character } from '../entity/Character.js';
import { BorderRepository } from '../repository/BorderRepository.js';
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

		const regions = new RegionRepository(
			serverState,
			loadedState.RegionRepository ?? []
		);
		serverState.registerRepository(Region, regions);

		const borders = new BorderRepository(
			serverState,
			loadedState.BorderRepository ?? []
		);
		serverState.registerRepository(Border, borders);

		console.log(JSON.stringify(serverState));

		return serverState;
	}
}
