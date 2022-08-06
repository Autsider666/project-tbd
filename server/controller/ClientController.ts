import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { container } from 'tsyringe';
import { Survivor, SurvivorDataMap } from '../config/SurvivorData.js';
import { Party, PartyId } from '../entity/Party.js';
import {
	BuildingCost,
	Settlement,
	SettlementBuilding,
	SettlementId,
} from '../entity/Settlement.js';
import { WorldId } from '../entity/World.js';
import { ExpeditionFactory } from '../factory/ExpeditionFactory.js';
import { PartyFactory } from '../factory/PartyFactory.js';
import { VoyageFactory } from '../factory/VoyageFactory.js';
import {
	ClientNotifier,
	NotificationCategory,
} from '../helper/ClientNotifier.js';
import { TravelTimeCalculator } from '../helper/TravelTimeCalculator.js';
import { ExpeditionRepository } from '../repository/ExpeditionRepository.js';
import { PartyRepository } from '../repository/PartyRepository.js';
import { RegionRepository } from '../repository/RegionRepository.js';
import { ResourceNodeRepository } from '../repository/ResourceNodeRepository.js';
import { SettlementRepository } from '../repository/SettlementRepository.js';
import { WorldRepository } from '../repository/WorldRepository.js';
import { ServerConfig } from '../serverConfig.js';
import {
	ClientToServerEvents,
	ServerToClientEvents,
	SocketData,
} from '../socket.io.js';

const secret = 'CHANGE ME QUICK!'; //TODO I mean it!

type PartyPayload = {
	party: PartyId;
	world: WorldId;
};

export class Client {
	public readonly parties = new Map<PartyId, Party>();
}

export class ClientController {
	private readonly client: Client;
	private readonly worldRepository: WorldRepository =
		container.resolve(WorldRepository);
	private readonly partyRepository: PartyRepository =
		container.resolve(PartyRepository);
	private readonly settlementRepository: SettlementRepository =
		container.resolve(SettlementRepository);
	private readonly resourceNodeRepository: ResourceNodeRepository =
		container.resolve(ResourceNodeRepository);
	private readonly regionRepository: RegionRepository =
		container.resolve(RegionRepository);
	private readonly expeditionRepository: ExpeditionRepository =
		container.resolve(ExpeditionRepository);
	private readonly voyageFactory: VoyageFactory =
		container.resolve(VoyageFactory);
	private readonly partyFactory: PartyFactory =
		container.resolve(PartyFactory);
	private readonly expeditionFactory: ExpeditionFactory =
		container.resolve(ExpeditionFactory);
	private readonly travelTimeCalculator: TravelTimeCalculator =
		container.resolve(TravelTimeCalculator);
	private readonly config: ServerConfig = container.resolve(ServerConfig);
	private readonly maxPartySize = this.config.get('maxPartySize');

	constructor(
		private readonly socket: Socket<
			ClientToServerEvents,
			ServerToClientEvents,
			any,
			SocketData
		>
	) {
		this.client = new Client();
		socket.data.client = this.client;
		this.handleSocket();
	}

	private handleSocket(): void {
		this.handlePartyInitialization();
		this.handlePartyCreation();
		this.handleSurvivorManagement();

		this.handleTravel();
		this.handleExpedition();
		this.handleSettlementManagement();

		this.socket.on('world:list', (callback) => {
			callback(
				this.worldRepository
					.getAll()
					.map((world) => world.normalize(this.client))
			);
		});

		this.socket.on('survivor:list', (callback) => {
			callback(SurvivorDataMap);
		});

		this.socket.on('settlement:list', ({ worldId }, callback) => {
			const world = this.worldRepository.get(worldId);
			if (world === null) {
				ClientNotifier.error(
					'This world does not exist',
					this.socket.id
				);
				return;
			}

			const regionsWithSettlement = world
				.getRegions()
				.filter((region) => region.getSettlement());
			const settlements = regionsWithSettlement.map((region) =>
				(region.getSettlement() as Settlement).normalize(this.client)
			);
			callback(settlements);
		});

		this.socket.on(
			'travel:calculate',
			({ originId, targetId }, callback) => {
				const origin = this.regionRepository.get(originId);
				if (!origin) {
					callback(null);
					return; //todo handle error
				}

				const target = this.regionRepository.get(targetId);
				if (!target) {
					callback(null);
					return; //todo handle error
				}

				if (origin.getWorld().getId() !== target.getWorld().getId()) {
					callback(null);
					return;
				}

				callback(
					this.travelTimeCalculator.calculateTravelTime(
						origin,
						target
					)
				);
			}
		);
	}

	private handlePartyInitialization(): void {
		this.socket.on('party:init', (token: string) => {
			if (token.length === 0) {
				return; //TODO add error handling
			}

			const payload = jwt.verify(token, secret) as PartyPayload; //TODO add error handling

			const party = this.partyRepository.get(payload.party);
			if (party === null) {
				return; //TODO error handling
			}

			this.initializeParty(party);
		});
	}

	private handlePartyCreation(): void {
		this.socket.on(
			'party:create',
			(
				data: { name: string; settlementId: SettlementId },
				callback: (token: string) => void
			) => {
				console.log('create party', data);

				const settlement = this.settlementRepository.get(
					data.settlementId ?? ('a' as SettlementId)
				);
				if (settlement === null) {
					ClientNotifier.error(
						'This settlement does not exist.',
						this.socket.id
					);
					return;
				}

				const name = data.name;
				const world = settlement.getRegion().getWorld();
				for (const region of world.getRegions()) {
					for (const existingParty of region
						.getSettlement()
						?.getParties() ?? []) {
						if (existingParty.name === name) {
							ClientNotifier.error(
								'Party name is already in use in this world.',
								this.socket.id
							);
							return;
						}
					}
				}

				const newParty = this.partyFactory.create(name, settlement);

				const payload: PartyPayload = {
					party: newParty.getId(),
					world: world.getId(),
				};

				const token = jwt.sign(payload, secret);
				callback(token);

				this.initializeParty(newParty as Party);
			}
		);
	}

	private initializeParty(party: Party): void {
		if (this.client.parties.has(party.getId())) {
			ClientNotifier.warning(
				'This party is already added to this session',
				this.socket.id
			);
			return;
		}

		console.log(
			`adding party "${party.name} (${party.getId()})" to ${
				this.socket.id
			}`
		);

		this.client.parties.set(party.getId(), party);

		const settlement = party.getSettlement();
		const region = settlement.getRegion();
		const world = region.getWorld();

		this.socket.join(party.getEntityRoomName());
		this.socket.join(settlement.getEntityRoomName());
		this.socket.join(region.getEntityRoomName());
		this.socket.join(world.getEntityRoomName());
	}

	private handleTravel(): void {
		this.socket.on('voyage:start', ({ partyId, targetId }): void => {
			const party = this.validatePartyForActivity(partyId);
			if (party === null) {
				return;
			}

			if (party.getSettlement().getId() === targetId) {
				ClientNotifier.error(
					'Party is already in this settlement',
					party.getUpdateRoomName()
				);
				return;
			}

			const target = this.settlementRepository.get(targetId);
			if (target === null) {
				ClientNotifier.error(
					'This settlement does not exist.',
					party.getUpdateRoomName()
				);
				return;
			}

			this.voyageFactory.create(party, target);
			ClientNotifier.success(
				`Party "${party.name}" is starting it's voyage to settlement "${target.name}".`,
				party.getUpdateRoomName()
			);
		});
	}

	private handleExpedition(): void {
		this.socket.on('expedition:start', ({ partyId, targetId }): void => {
			const party = this.validatePartyForActivity(partyId);
			if (party === null) {
				return;
			}
			const target = this.resourceNodeRepository.get(targetId);
			if (target === null) {
				ClientNotifier.error(
					'This resource node does not exist.',
					party.getUpdateRoomName()
				);
				return;
			}

			this.expeditionFactory.create(party, target);
			ClientNotifier.success(
				`Party "${party.name}" is starting it's expedition to ${target.name}.`,
				party.getUpdateRoomName(),
				[NotificationCategory.general, NotificationCategory.expedition]
			);
		});

		this.socket.on('expedition:list', ({ partyId }, callback) => {
			const party = this.getParty(partyId);
			if (!party) {
				return null;
			}

			callback(
				this.expeditionRepository
					.getAllByParty(partyId)
					.map((expedition) => expedition.normalize(this.client))
			);
		});
	}

	private validatePartyForActivity(
		id: PartyId,
		checkPartySize: boolean = true
	): Party | null {
		const party =
			this.client.parties.get(id) ?? id === 'test'
				? Array.from(this.client.parties.values())[0]
				: null;
		if (!party) {
			ClientNotifier.error(
				"You don't control this party.",
				this.socket.id
			);

			return null;
		}
		if (party.dead) {
			ClientNotifier.error(
				"This party has been defeated and can't do anything anymore.",
				this.socket.id
			);

			return null;
		}

		if (checkPartySize && party.getSurvivors().length > this.maxPartySize) {
			ClientNotifier.error(
				`Party "${party.name}" can't do this because it has more than ${this.maxPartySize} survivors.`,
				party.getUpdateRoomName()
			);

			return null;
		}

		if (party.getVoyage() !== null) {
			ClientNotifier.error(
				`Party "${party.name}" is on a voyage.`,
				party.getUpdateRoomName()
			);

			return null;
		}

		if (party.getExpedition() !== null) {
			ClientNotifier.error(
				`Party "${party.name}" is on an expedition.`,
				party.getUpdateRoomName()
			);

			return null;
		}

		return party;
	}

	private handleSurvivorManagement(): void {
		this.socket.on('survivor:recruit', ({ partyId, type }) => {
			if (!(type in Survivor)) {
				ClientNotifier.error(
					`"${type}" is not a valid Survivor type.`,
					this.socket.id
				);
				return;
			}

			const party = this.validatePartyForActivity(partyId);
			if (party === null) {
				return;
			}

			const settlement = party.getSettlement();
			for (const survivor of settlement.getSurvivors()) {
				if (survivor !== type) {
					continue;
				}

				settlement.transferSurvivorTo(survivor, party);

				ClientNotifier.success(
					`${Survivor[type]} has been added to party "${party.name}"`,
					party.getUpdateRoomName()
				);

				return;
			}

			ClientNotifier.error(
				'This survivor is not accessible to this party.',
				party.getUpdateRoomName()
			);
		});

		this.socket.on('survivor:dismiss', ({ partyId, type }) => {
			if (!(type in Survivor)) {
				ClientNotifier.error(
					`"${type}" is not a valid Survivor type.`,
					this.socket.id
				);
				return;
			}

			const party = this.validatePartyForActivity(partyId, false);
			if (party === null) {
				return;
			}

			const survivors = party.getSurvivors();
			if (survivors.length === 1) {
				ClientNotifier.warning(
					`Cannot remove the last survivor of party "${party.name}`,
					party.getUpdateRoomName()
				);
				return;
			}

			for (const survivor of survivors) {
				if (survivor !== type) {
					continue;
				}

				party.transferSurvivorTo(survivor, party.getSettlement());

				ClientNotifier.success(
					`${Survivor[type]} has left party "${party.name}"`,
					party.getUpdateRoomName()
				);

				return;
			}

			ClientNotifier.error(
				'This survivor is not accessible to this party.',
				party.getUpdateRoomName()
			);
		});
	}

	private handleSettlementManagement() {
		this.socket.on(
			'settlement:upgrade:start',
			({ settlementId, building }) => {
				if (!(building in SettlementBuilding)) {
					ClientNotifier.error(
						`"${building}" is not a valid building.`,
						this.socket.id
					);
					return;
				}

				const settlement = this.settlementRepository.get(settlementId);
				if (settlement === null) {
					ClientNotifier.error(
						'This settlement does not exist.',
						this.socket.id
					);
					return;
				}

				if (settlement.settlementUpgrade !== null) {
					ClientNotifier.error(
						'This settlement is already upgrading something.',
						this.socket.id
					);
					return;
				}

				const upgradeCost =
					1000 * Math.pow(2, settlement.buildings[building]);
				const resourceType = BuildingCost[building];
				if (!settlement.removeResource(upgradeCost, resourceType)) {
					ClientNotifier.error(
						'This settlement does not have enough resources.',
						this.socket.id
					);
					return;
				}

				settlement.removeResource(upgradeCost, resourceType);
				settlement.settlementUpgrade = {
					type: building,
					remainingWork: upgradeCost,
				};
				ClientNotifier.success(
					`Settlement "${settlement.name}" has started a project to upgrade its ${building}.`,
					settlement.getUpdateRoomName()
				);

				ClientNotifier.error(
					`You don't have a party in settlement "${settlement.name}".`,
					this.socket.id
				);
			}
		);
	}

	private getParty(id: PartyId): Party | null {
		const party =
			this.client.parties.get(id) ?? id === 'test'
				? Array.from(this.client.parties.values())[0]
				: null;
		if (party === null) {
			ClientNotifier.error(
				"You don't control this party",
				this.socket.id
			);
		}

		return party;
	}
}
