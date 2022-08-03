import 'reflect-metadata';
import EventEmitter from 'events';
import { container } from 'tsyringe';
import { TestController } from './controller/TestController.js';
import { ServerConfig } from './serverConfig.js';
import { ServerController } from './controller/ServerController.js';
import { StateSyncController } from './controller/StateSyncController.js';
import { WorldFactory } from './factory/WorldFactory.js';
import { instrument } from '@socket.io/admin-ui';
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { Server } from 'socket.io';
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
} from './socket.io.js';

const config = container.resolve(ServerConfig);
Error.stackTraceLimit = config.get('stackTraceLimit');

const app = express();

const httpServer = createServer(app);

const io = new Server<
	ClientToServerEvents,
	ServerToClientEvents,
	any,
	SocketData
>(httpServer, {
	cors: {
		origin: config.get('corsOrigin'),
		// credentials: true,
	},
});

container.register(Server, { useValue: io });
container.register(EventEmitter, { useValue: new EventEmitter() });

app.get('/', (_, res) => res.sendFile(path.resolve('./server/test.html')));

const worldFactory = container.resolve(WorldFactory);
app.get('/state', (_, res) =>
	res.send(
		`<pre>${JSON.stringify(
			worldFactory.create().prepareNestedEntityUpdate(),
			null,
			4
		)}</pre>`
	)
);

instrument(io, {
	auth: false,
});

const port = config.get('port');
const host = config.get('host');

httpServer.listen(port, host, async () => {
	console.info(`🚀 Server is listening 🚀`);
	console.info(`http://${host}:${port}`);

	await container.resolve(ServerController).start();
	if (config.get('env') === 'dev') {
		await container.resolve(TestController).start();
	}

	container.resolve(StateSyncController);
});
