import { Client } from './controller/ClientController.js';
import { EntityUpdate } from './controller/StateSyncController.js';

export interface ServerToClientEvents {
	'entity:update': (entities: EntityUpdate) => void;

	//Default to keep PhpStorm calm
	[event: string]: (...args: any[]) => void;
}

export interface ClientToServerEvents {
	'party:init': (token: string) => void;
	'party:create': (
		data: { name: string },
		callback: (token: string) => void
	) => void;

	//Default to keep PhpStorm calm
	[event: string]: (...args: any[]) => void;
}

export interface SocketData {
	client: Client;
}
