export type Combatant = {
	name: string;
	hp: number;
	damage: number;
};

export interface Enemy extends Combatant {
	damageTaken: number;
}
