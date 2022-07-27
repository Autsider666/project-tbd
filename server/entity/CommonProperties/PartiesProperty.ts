import { PartyRepository } from '../../repository/PartyRepository.js';
import { Party, PartyId } from '../Party.js';
import { MultiCommonProperty } from './MultiCommonProperty.js';

export class PartiesProperty extends MultiCommonProperty<PartyId, Party> {
	constructor(parties: PartyId[]) {
		super(parties, PartyRepository);
	}
}
