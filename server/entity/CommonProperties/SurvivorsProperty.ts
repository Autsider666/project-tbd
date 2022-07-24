import { ServerState } from '../../ServerState.js';
import { Survivor, SurvivorId } from '../Survivor.js';

export class SurvivorsProperty {
	private readonly survivors = new Map<SurvivorId, Survivor | null>();

	constructor(
		protected readonly serverState: ServerState,
		survivors: SurvivorId[]
	) {
		survivors.forEach((id) => this.survivors.set(id, null));
	}

	public getAll(): Survivor[] {
		this.survivors.forEach((survivor, id) => {
			if (survivor != null) {
				return;
			}

			const lazyLoadedSurvivor = this.serverState
				.getRepository(Survivor)
				.get(id);
			if (lazyLoadedSurvivor === null) {
				throw new Error('.... uhm.....');
			}

			this.survivors.set(id, lazyLoadedSurvivor);
		});

		return Array.from(this.survivors.values()) as Survivor[];
	}

	public add(survivor: Survivor): void {
		this.survivors.set(survivor.getId(), survivor);
	}

	public toJSON(): SurvivorId[] {
		return Array.from(this.survivors.keys());
	}
}
