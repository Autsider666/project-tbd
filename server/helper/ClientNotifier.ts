import { Server } from 'socket.io';
import { container } from 'tsyringe';

export class ClientNotifier {
	public static success(message: string, room: string): void {
		this.notify(message, room, 'success');
	}

	public static info(message: string, room: string): void {
		this.notify(message, room, 'info');
	}

	public static warning(message: string, room: string): void {
		this.notify(message, room, 'warning');
	}

	public static error(message: string, room: string): void {
		this.notify(message, room, 'error');
	}

	private static notify(message: string, room: string, type: string): void {
		container
			.resolve(Server)
			.to(room)
			.emit('notification', message as any, type as any);
	}
}
