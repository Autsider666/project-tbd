import { ServerState } from '../../ServerState.js';
import { Settlement, SettlementId } from '../Settlement.js';
import { SingleCommonProperty } from './SingleCommonProperty.js';

export class SettlementProperty extends SingleCommonProperty<
	SettlementId,
	Settlement
> {
	constructor(
		serverState: ServerState,
		settlement: SettlementId | Settlement
	) {
		super(serverState, settlement, Settlement);
	}
}
