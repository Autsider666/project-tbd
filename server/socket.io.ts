import { Entity } from './entity/Entity.js';

export interface ServerToClientEvents {
	'entity:update': (entities: Entity<any, any>[]) => void;

	//Default to keep PhpStorm calm
	[event: string]: (...args: any[]) => void;
}

export interface ClientToServerEvents {
	'character:init': (token: string) => void;
	'character:create': (
		data: { name: string },
		callback: (token: string) => void
	) => void;

	//Default to keep PhpStorm calm
	[event: string]: (...args: any[]) => void;
}
