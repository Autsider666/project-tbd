import { Client } from './controller/ClientController.js';
import { EntityUpdate } from './controller/StateSyncController.js';
import { PartyId } from './entity/Party.js';
import { SettlementId } from './entity/Settlement.js';
import { NotificationSeverity } from './helper/ClientNotifier.js';

export interface ServerToClientEvents {
	'entity:update': (entities: EntityUpdate) => void;
	notification: (notification: { message: string; severity: NotificationSeverity }) => void;

	//Default to keep PhpStorm calm
	[event: string]: (...args: any[]) => void;
}

export interface ClientToServerEvents {
	'party:init': (token: string) => void;
	'party:create': (
		data: { name: string },
		callback: (token: string) => void
	) => void;
	'voyage:start': (data: {
		partyId: PartyId;
		targetId: SettlementId;
	}) => void;

	//Default to keep PhpStorm calm
	[event: string]: (...args: any[]) => void;
}

export interface SocketData {
	client: Client;
}
