import { Client } from './controller/ClientController.js';
import { EntityUpdate } from './controller/StateSyncController.js';
import { PartyId } from './entity/Party.js';
import { SettlementId } from './entity/Settlement.js';

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
	'party:travel': (data: {
		partyId: PartyId;
		targetId: SettlementId;
	}) => void;

	//Default to keep PhpStorm calm
	[event: string]: (...args: any[]) => void;
}

export interface SocketData {
	client: Client;
}
