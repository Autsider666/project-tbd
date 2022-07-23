import {
	Character,
	CharacterId,
	CharacterStateData,
} from '../entity/Character.js';
import { Repository } from './Repository.js';
import { Constructor } from 'type-fest';

export class CharacterRepository extends Repository<
	Character,
	CharacterId,
	CharacterStateData
> {
	protected entity(): Constructor<Character> {
		return Character;
	}
}
