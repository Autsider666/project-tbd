import { VoyageRepository } from '../../repository/VoyageRepository.js';
import { Voyage, VoyageId } from '../Voyage.js';
import { SingleCommonProperty } from './SingleCommonProperty.js';

export class VoyageProperty extends SingleCommonProperty<VoyageId, Voyage> {
	constructor(voyage: VoyageId | Voyage) {
		super(voyage, VoyageRepository);
	}
}
