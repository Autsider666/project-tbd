import { PartyRepository } from '../../repository/PartyRepository.js';
import { Party, PartyId } from '../Party.js';
import { SingleCommonProperty } from './SingleCommonProperty.js';

export class PartyProperty extends SingleCommonProperty<PartyId, Party> {
	constructor(party: PartyId | Party) {
		super(party, PartyRepository);
	}
}
