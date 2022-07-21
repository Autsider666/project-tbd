import { randomUUID } from 'crypto';
import { Opaque } from 'type-fest';

export type Uuid = Opaque<string, 'uuid'>;

export function generateUUID(): Uuid {
	return randomUUID() as Uuid;
}
