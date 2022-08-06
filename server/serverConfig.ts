import convict, { Path } from 'convict';
import dotenv from 'dotenv';
import path, { join } from 'path';
import { container, singleton } from 'tsyringe';
import { fileURLToPath } from 'url';

dotenv.config();

type ConfigTemplate = {
	env: string;
	stackTraceLimit: number;
	port: number;
	host: string;
	corsOrigin: string[];
	serverTickTime: number;
	gatherSpeedMultiplier: number;
	expeditionRecruitmentChance: number;
	expeditionCombatChance: number;
	expeditionRecruitment: {
		1: number;
	};
	maxPartySize: number;
	secondsBetweenCombatInSamePhase: number;
	settlementStartingHp: number;
	settlementStartingDamage: number;
	settlementRaidChance: number;
	maxPartyEnergy: number;
};

@singleton()
export class ServerConfig {
	private readonly config: convict.Config<ConfigTemplate>;

	constructor() {
		this.config = convict<ConfigTemplate>({
			env: {
				format: ['prod', 'dev', 'test'],
				default: 'dev',
				arg: 'nodeEnv',
				env: 'NODE_ENV',
			},
			stackTraceLimit: {
				format: Number,
				default: 10,
				arg: 'stackTraceLimit',
				env: 'STACK_TRACE_LIMIT',
			},
			port: {
				format: Number,
				default: 5000,
				arg: 'port',
				env: 'PORT',
			},
			host: {
				format: String,
				default: '0.0.0.0',
				arg: 'host',
				env: 'HOST',
			},
			corsOrigin: {
				format: Array,
				default: [],
			},
			serverTickTime: {
				format: Number,
				default: 5000,
				arg: 'serverTickTime',
				env: 'SERVER_TICK_TIME',
			},
			gatherSpeedMultiplier: {
				format: Number,
				default: 1,
				arg: 'gatherSpeedMultiplier',
				env: 'GATHER_SPEED_MULTIPLIER',
			},
			expeditionRecruitmentChance: {
				format: Number,
				default: 5,
				arg: 'expeditionRecruitmentChance',
				env: 'EXPEDITION_RECRUITMENT_CHANCE',
			},
			expeditionCombatChance: {
				format: Number,
				default: 5,
				arg: 'expeditionCombatChance',
				env: 'EXPEDITION_COMBAT_CHANCE',
			},
			expeditionRecruitment: {
				1: {
					format: Number,
					default: 100,
				},
			},
			maxPartySize: {
				format: Number,
				default: 10,
				arg: 'maxPartySize',
				env: 'MAX_PARTY_SIZE',
			},
			secondsBetweenCombatInSamePhase: {
				format: Number,
				default: 15,
				arg: 'secondsBetweenCombatInSamePhase',
				env: 'SECONDS_BETWEEN_COMBAT_IN_SAME_PHASE',
			},
			settlementStartingHp: {
				format: Number,
				default: 10000,
			},
			settlementStartingDamage: {
				format: Number,
				default: 100,
			},
			settlementRaidChance: {
				format: Number,
				default: 1,
			},
			maxPartyEnergy: {
				format: Number,
				default: 1000,
			},
		});

		const env = this.get('env');
		try {
			this.config.loadFile(
				join(
					path.dirname(fileURLToPath(import.meta.url)),
					'../config/' + env + '.json'
				)
			);
		} catch (e) {
			console.log(e);
		}

		this.config.validate({ allowed: 'strict' });
		for (const [key, value] of Object.entries(
			this.config.getProperties()
		)) {
			container.register(key, { useValue: value });
		}

		if (env === 'dev') {
			console.log(this.getAll());
		}
	}

	get(key: Path<ConfigTemplate>): any {
		return this.config.get(key);
	}

	getAll(): ConfigTemplate {
		return this.config.getProperties();
	}
}
