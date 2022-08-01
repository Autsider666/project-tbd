import 'reflect-metadata';
import 'loud-rejection/register.js';
import EventEmitter from 'events';
import { Db, MongoClient } from 'mongodb';
import { container, registry } from 'tsyringe';
import { Constructor } from 'type-fest';
import { ServerController } from './controller/ServerController.js';
import { StateSyncController } from './controller/StateSyncController.js';
import { WorldFactory } from './factory/WorldFactory.js';
import { instrument } from '@socket.io/admin-ui';
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { Repository } from './repository/Repository.js';
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
} from './socket.io.js';

Error.stackTraceLimit = 50;

const port = 5000;
const host = '0.0.0.0';
const corsOrigin = ['http://localhost:3000', 'https://admin.socket.io'];

const app = express();

const httpServer = createServer(app);

const io = new Server<
	ClientToServerEvents,
	ServerToClientEvents,
	any,
	SocketData
>(httpServer, {
	cors: {
		origin: corsOrigin,
		// credentials: true,
	},
});

const client = new MongoClient(
	process.env.MONGO_URL ?? 'mongodb://localhost:27017'
);
await client.connect();
const database = client.db(process.env.MONGO_DB ?? 'tbd');

container.register(MongoClient, { useValue: client });
container.register(Db, { useValue: database });

container.register(Server, { useValue: io });
container.register(EventEmitter, { useValue: new EventEmitter() });

app.get('/', (_, res) => res.sendFile(path.resolve('./server/test.html')));

const worldFactory = container.resolve(WorldFactory);
app.get('/state', async (_, res) =>
	res.send(
		`<pre>${JSON.stringify(
			await (await worldFactory.create()).prepareNestedEntityUpdate(),
			null,
			4
		)}</pre>`
	)
);

instrument(io, {
	auth: false,
});

httpServer.listen(port, host, async () => {
	const repositories =
		container.resolveAll<Constructor<Repository<any, any, any>>>(
			'Repository'
		);
	for (const identifier of repositories) {
		const repository = container.resolve(identifier);
		await repository.init();
	}

	console.info(`🚀 Server is listening 🚀`);
	console.info(`http://${host}:${port}`);

	await container.resolve(ServerController).start();

	container.resolve(StateSyncController);
});
