import { Server } from 'socket.io';
import { container } from 'tsyringe';

export enum NotificationSeverity {
	info = 'info',
	success = 'success',
	warning = 'warning',
	error = 'error',
}

export enum NotificationCategory {
	general = 'general',
	expedition = 'expedition',
	combat = 'combat',
}

export class ClientNotifier {
	public static success(
		message: string,
		room: string,
		categories: NotificationCategory[] = [NotificationCategory.general]
	): void {
		this.notify(message, room, NotificationSeverity.success, categories);
	}

	public static info(
		message: string,
		room: string,
		categories: NotificationCategory[] = [NotificationCategory.general]
	): void {
		this.notify(message, room, NotificationSeverity.info, categories);
	}

	public static warning(
		message: string,
		room: string,
		categories: NotificationCategory[] = [NotificationCategory.general]
	): void {
		this.notify(message, room, NotificationSeverity.warning, categories);
	}

	public static error(
		message: string,
		room: string,
		categories: NotificationCategory[] = [NotificationCategory.general]
	): void {
		this.notify(message, room, NotificationSeverity.error, categories);
	}

	private static notify(
		message: string,
		room: string,
		severity: NotificationSeverity,
		categories: NotificationCategory[]
	): void {
		container
			.resolve(Server)
			.to(room)
			.emit('notification', {
				message,
				severity,
				categories,
			} as any);
	}
}
