import { Client } from './controller/ClientController.js';
import { EntityUpdate } from './controller/StateSyncController.js';
import { PartyId } from './entity/Party.js';
import { ResourceNodeId } from './entity/ResourceNode.js';
import { SettlementClientData, SettlementId } from './entity/Settlement.js';
import { WorldClientData, WorldId } from './entity/World.js';
import { NotificationSeverity } from './helper/ClientNotifier.js';

export interface ServerToClientEvents {
	'entity:update': (entities: EntityUpdate) => void;
	notification: (notification: {
		message: string;
		severity: NotificationSeverity;
	}) => void;

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
	'expedition:start': (data: {
		partyId: PartyId;
		targetId: ResourceNodeId;
	}) => void;
	'world:list': (callback: (worlds: WorldClientData[]) => void) => void;
	'settlement:list': (
		data: { worldId: WorldId },
		callback: (settlements: SettlementClientData[]) => void
	) => void;

	//Default to keep PhpStorm calm
	[event: string]: (...args: any[]) => void;
}

export interface SocketData {
	client: Client;
}
