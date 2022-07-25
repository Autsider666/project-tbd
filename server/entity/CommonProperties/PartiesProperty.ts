import { ServerState } from '../../ServerState.js';
import { Party, PartyId } from '../Party.js';
import { MultiCommonProperty } from './MultiCommonProperty.js';

export class PartiesProperty extends MultiCommonProperty<PartyId, Party> {
	constructor(serverState: ServerState, regions: PartyId[]) {
		super(serverState, regions, Party);
	}
}
