import { Server, Socket } from 'socket.io';

export class ClientController {
	constructor(private readonly socket: Socket, private readonly io: Server) {
		console.log(this.socket.id + ' is initialized.');
	}
}
