import { BorderRepository } from '../../repository/BorderRepository.js';
import { Border, BorderId } from '../Border.js';
import { MultiCommonProperty } from './MultiCommonProperty.js';

export class BordersProperty extends MultiCommonProperty<BorderId, Border> {
	constructor(borders: BorderId[]) {
		super(borders, BorderRepository);
	}
}
