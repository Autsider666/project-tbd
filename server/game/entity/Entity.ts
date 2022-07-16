import { ServerState } from '../../ServerState.js';

export abstract class Entity<TId extends number, TData extends object> {
	public abstract id: TId;

	protected constructor(
		protected readonly serverState: ServerState,
		data: TData
	) {}

	public abstract denormalize(data: TData): void;

	public abstract normalize(): TData;

	public onCreate(): void {}

	public toJSON(): TData {
		return this.normalize();
	}
}
