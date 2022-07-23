import {
	Party,
	PartyId,
	PartyStateData,
} from '../entity/Party.js';
import { Repository } from './Repository.js';
import { Constructor } from 'type-fest';

export class PartyRepository extends Repository<
	Party,
	PartyId,
	PartyStateData
> {
	protected entity(): Constructor<Party> {
		return Party;
	}
}
