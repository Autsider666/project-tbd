import { ServerState } from '../../ServerState.js';
import { Voyage, VoyageId } from '../Voyage.js';
import { SingleCommonProperty } from './SingleCommonProperty.js';

export class VoyageProperty extends SingleCommonProperty<VoyageId, Voyage> {
	constructor(serverState: ServerState, party: VoyageId | Voyage) {
		super(serverState, party, Voyage);
	}
}
