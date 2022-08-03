import { Client } from './controller/ClientController.js';
import { EntityUpdate } from './controller/StateSyncController.js';
import { Enemy } from './entity/CommonTypes/Combat.js';
import { ExpeditionClientData } from './entity/Expedition.js';
import { PartyId } from './entity/Party.js';
import { RegionId } from './entity/Region.js';
import { ResourceType } from './entity/Resource.js';
import { ResourceNodeId } from './entity/ResourceNode.js';
import { SettlementClientData, SettlementId } from './entity/Settlement.js';
import { SurvivorId } from './entity/Survivor.js';
import { WorldClientData, WorldId } from './entity/World.js';
import { SurvivorType } from './factory/SurvivorFactory.js';
import {
	NotificationCategory,
	NotificationSeverity,
} from './helper/ClientNotifier.js';
import { PathResult } from './helper/TravelTimeCalculator.js';

export interface ServerToClientEvents {
	'entity:update': (entities: EntityUpdate) => void;
	notification: (notification: {
		message: string;
		severity: NotificationSeverity;
		categories: NotificationCategory[];
	}) => void;

	'server:turn': (data: { startedAt: Date; endsAt: Date }) => void;

	//Default to keep PhpStorm calm
	[event: string]: (...args: any[]) => void;
}

export interface ClientToServerEvents {
	'party:init': (token: string) => void;
	'party:create': (
		data: { name: string; settlementId: SettlementId },
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
	'expedition:list': (
		data: { partyId: PartyId },
		callback: (expeditions: ExpeditionClientData[]) => void
	) => void;
	'world:list': (callback: (worlds: WorldClientData[]) => void) => void;
	'settlement:list': (
		data: { worldId: WorldId },
		callback: (settlements: SettlementClientData[]) => void
	) => void;
	'travel:calculate': (
		data: { originId: RegionId; targetId: RegionId },
		callback: (path: PathResult | null) => void
	) => void;
	'survivor:recruit': (data: {
		partyId: PartyId;
		survivorId: SurvivorId;
	}) => void;
	'survivor:dismiss': (data: {
		partyId: PartyId;
		survivorId: SurvivorId;
	}) => void;

	'test:raid:start': (data: {
		settlementId: SettlementId;
		enemy?: Enemy;
	}) => void;
	'test:raid:stop': (data: { settlementId: SettlementId }) => void;
	'test:resource:add': (data: {
		containerId: SettlementId | PartyId;
		amount: number;
		resource: ResourceType;
	}) => void;
	// 'test:resource:remove': (data: { settlementId: SettlementId, amount: number, resource: ResourceType }) => void;
	// 'test:settlement:upgrade': (data: { settlementId: SettlementId }) => void;
	'test:survivor:add': (data: {
		containerId: SettlementId | PartyId;
		template: SurvivorType;
	}) => void;
	'test:survivor:remove': (data: { survivorId: SurvivorId }) => void;

	//Default to keep PhpStorm calm
	[event: string]: (...args: any[]) => void;
}

export interface SocketData {
	client: Client;
}
