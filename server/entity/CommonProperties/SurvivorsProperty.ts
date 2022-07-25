import { ServerState } from '../../ServerState.js';
import { Survivor, SurvivorId } from '../Survivor.js';
import { MultiCommonProperty } from './MultiCommonProperty.js';

export class SurvivorsProperty extends MultiCommonProperty<
	SurvivorId,
	Survivor
> {
	constructor(serverState: ServerState, survivors: SurvivorId[]) {
		super(serverState, survivors, Survivor);
	}
}
