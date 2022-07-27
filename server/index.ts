import 'reflect-metadata';
import EventEmitter from 'events';
import { container } from 'tsyringe';
import { ServerController } from './controller/ServerController.js';
import { StateSyncController } from './controller/StateSyncController.js';
import { StatePersister } from './helper/StatePersister.js';
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

const port = 5000;
const host = 'localhost';
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

container.register(Server, { useValue: io });
container.register(EventEmitter, { useValue: new EventEmitter() });

app.get('/', (_, res) => res.sendFile(path.resolve('./server/test.html')));

const state = await StatePersister.readState();

app.get('/state', (_, res) =>
	res.send(`<pre>${JSON.stringify(state, null, 4)}</pre>`)
);

instrument(io, {
	auth: false,
});

httpServer.listen(port, host, async () => {
	console.info(`🚀 Server is listening 🚀`);
	console.info(`http://${host}:${port}`);

	await container.resolve(ServerController).start();

	container.resolve(StateSyncController);
});
