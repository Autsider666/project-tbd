import { promises as fsPromises } from 'fs';
import path, { join } from 'path';
import { Constructor } from 'type-fest';
import { fileURLToPath } from 'url';
import { Border } from '../entity/Border.js';
import { Entity } from '../entity/Entity.js';
import { Expedition } from '../entity/Expedition.js';
import { Resource } from '../entity/Resource.js';
import { ResourceNode } from '../entity/ResourceNode.js';
import { Settlement } from '../entity/Settlement.js';
import { Survivor } from '../entity/Survivor.js';
import { Voyage } from '../entity/Voyage.js';
import { ExpeditionRepository } from '../repository/ExpeditionRepository.js';
import { ResourceNodeRepository } from '../repository/ResourceNodeRepository.js';
import { RegionRepository } from '../repository/RegionRepository.js';
import { Region } from '../entity/Region.js';
import { Party } from '../entity/Party.js';
import { BorderRepository } from '../repository/BorderRepository.js';
import { PartyRepository } from '../repository/PartyRepository.js';
import { World } from '../entity/World.js';
import { Repository } from '../repository/Repository.js';
import { ResourceRepository } from '../repository/ResourceRepository.js';
import { SettlementRepository } from '../repository/SettlementRepository.js';
import { SurvivorRepository } from '../repository/SurvivorRepository.js';
import { VoyageRepository } from '../repository/VoyageRepository.js';
import { ServerState } from '../ServerState.js';
import { WorldRepository } from '../repository/WorldRepository.js';

const filename = '../../state.json';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const repositories = new Map<
	Constructor<Entity<any, any, any>>,
	Constructor<Repository<any, any, any>>
>();

repositories.set(World, WorldRepository);
repositories.set(Survivor, SurvivorRepository);
repositories.set(Party, PartyRepository);
repositories.set(Region, RegionRepository);
repositories.set(Border, BorderRepository);
repositories.set(Settlement, SettlementRepository);
repositories.set(Expedition, ExpeditionRepository);
repositories.set(ResourceNode, ResourceNodeRepository);
repositories.set(Resource, ResourceRepository);
repositories.set(Voyage, VoyageRepository);

export class StatePersister {
	static async writeState(state: ServerState) {
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

		repositories.forEach((repositoryClass, entityClass) => {
			const repository = new repositoryClass(
				serverState,
				loadedState[repositoryClass.name ?? []]
			);

			serverState.registerRepository(entityClass, repository);
		});

		return serverState;
	}
}
