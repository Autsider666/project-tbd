export interface System {
	tick(now: Date): Promise<void>;
}
