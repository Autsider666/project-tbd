import { ServerState } from '../../ServerState.js';
import { Party, PartyId } from '../Party.js';
import { SingleCommonProperty } from './SingleCommonProperty.js';

export class PartyProperty extends SingleCommonProperty<PartyId, Party> {
	constructor(serverState: ServerState, party: PartyId | Party) {
		super(serverState, party, Party);
	}
}
