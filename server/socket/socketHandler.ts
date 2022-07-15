import { Server, Socket } from 'socket.io';

const EVENTS = {
	CLIENT: {
		CONNECTION: 'connection',
		SEND_MESSAGE: 'message',
	},
	SERVER: {
		SEND_MESSAGE: 'message',
	},
};

export function socketHandler({ io }: { io: Server }): void {
	console.info(`Sockets enabled`);

	io.on(EVENTS.CLIENT.CONNECTION, (socket: Socket) => {
		console.info(`User connected ${socket.id}`);

		socket.on(EVENTS.CLIENT.SEND_MESSAGE, (message: any) => {
			console.log('Received message:', message);

			socket.emit(EVENTS.SERVER.SEND_MESSAGE, 'Message received.');

			socket.broadcast.emit(EVENTS.SERVER.SEND_MESSAGE, message);
		});
	});
}
