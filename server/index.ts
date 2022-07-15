import { instrument } from '@socket.io/admin-ui';
import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { socketHandler } from './socket/socketHandler';
import { Server } from 'socket.io';
import { version } from './../package.json';

const port = 5000;
const host = 'localhost';
const corsOrigin = ['http://localhost:3000', 'https://admin.socket.io'];

const app = express();

const httpServer = createServer(app);

const io = new Server(httpServer, {
	cors: {
		origin: corsOrigin,
		// credentials: true,
	},
});

app.get('/', (_, res) =>
	// res.send(`Server is up and running version ${version}`)
	res.sendFile(path.resolve('./server/test.html'))
);

instrument(io, {
	auth: false,
});

httpServer.listen(port, host, () => {
	console.info(`🚀 Server version ${version} is listening 🚀`);
	console.info(`http://${host}:${port}`);

	socketHandler({ io });
});
