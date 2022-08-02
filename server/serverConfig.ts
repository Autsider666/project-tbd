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
	expeditionRecruitmentChange: number;
	expeditionRecruitment: {
		0: number;
	};
	maxPartySize: number;
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
			expeditionRecruitmentChange: {
				format: Number,
				default: 5,
			},
			expeditionRecruitment: {
				0: {
					format: Number,
					default: 100,
				},
			},
			maxPartySize: {
				format: Number,
				default: 10,
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
