import { ServerState } from '../../ServerState.js';
import { Settlement, SettlementId } from '../Settlement.js';

export class SettlementProperty {
	constructor(
		protected readonly serverState: ServerState,
		protected settlement: SettlementId | Settlement
	) {}

	public getSettlement(): Settlement {
		if (typeof this.settlement === 'string') {
			const repository = this.serverState.getRepository(Settlement);

			const settlement = repository.get(this.settlement as SettlementId);
			if (settlement === null) {
				throw new Error('.... uhm.....');
			}

			this.settlement = settlement;
		}

		return this.settlement as Settlement;
	}

	public toJSON(): SettlementId {
		return typeof this.settlement === 'string'
			? this.settlement
			: (this.settlement as Settlement).getId();
	}
}
