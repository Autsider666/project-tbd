export interface System {
	tick(): Promise<void>;
}
