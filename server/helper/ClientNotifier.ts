import { Server } from 'socket.io';
import { container } from 'tsyringe';

export enum NotificationSeverity {
	info = 'info',
	success = 'success',
	warning = 'warning',
	error = 'error',
}

export class ClientNotifier {
	public static success(message: string, room: string): void {
		this.notify(message, room, NotificationSeverity.success);
	}

	public static info(message: string, room: string): void {
		this.notify(message, room, NotificationSeverity.info);
	}

	public static warning(message: string, room: string): void {
		this.notify(message, room, NotificationSeverity.warning);
	}

	public static error(message: string, room: string): void {
		this.notify(message, room, NotificationSeverity.error);
	}

	private static notify(
		message: string,
		room: string,
		severity: NotificationSeverity
	): void {
		container
			.resolve(Server)
			.to(room)
			.emit('notification', {
				message,
				severity,
			} as any);
	}
}
