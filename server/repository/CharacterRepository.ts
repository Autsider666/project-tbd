import { Character, CharacterId, CharacterData } from '../entity/Character.js';
import { Repository } from './Repository.js';
import { Constructor } from 'type-fest';

export class CharacterRepository extends Repository<
	Character,
	CharacterId,
	CharacterData
> {
	protected entity(): Constructor<Character> {
		return Character;
	}
}
