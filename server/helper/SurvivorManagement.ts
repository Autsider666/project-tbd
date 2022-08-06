import { SocketId } from 'socket.io-adapter';
import { Survivor, SurvivorDataMap } from '../config/SurvivorData.js';
import { PartyId } from '../entity/Party.js';
import { ClientNotifier } from './ClientNotifier.js';

export const upgradeSurvivor = (
	{
		partyId,
		currentType,
		targetType,
	}: { partyId: PartyId; currentType: Survivor; targetType: Survivor },
	socketId: SocketId
) => {
	if (!(currentType in Survivor)) {
		ClientNotifier.error(
			`"${currentType}" is not a valid Survivor type.`,
			socketId
		);
		return;
	}

	if (!(targetType in Survivor)) {
		ClientNotifier.error(
			`"${targetType}" is not a valid Survivor type.`,
			socketId
		);
		return;
	}

	const currentSurvivor = SurvivorDataMap[currentType];
	const upgradeCost = currentSurvivor.nextUpgradeCost;
	if (!currentSurvivor.upgrades.includes(targetType) || upgradeCost === -1) {
		ClientNotifier.error(
			`Survivor "${currentType}" cannot be upgrade into "${targetType}".`,
			socketId
		);
		return;
	}

	const party = this.validatePartyForActivity(partyId);
	if (party === null) {
		return;
	}

	if (upgradeCost > party.energy) {
		ClientNotifier.error(
			`Party "${party.name}" is ${Math.abs(
				party.energy - upgradeCost
			)} energy short to upgrade this survivor.`,
			party.getUpdateRoomName()
		);

		return;
	}

	if (!party.removeSurvivor(currentType)) {
		ClientNotifier.error(
			`There are no available ${currentType} in party "${party.name}".`,
			party.getUpdateRoomName()
		);
	}

	party.energy -= upgradeCost;

	party.addSurvivor(targetType);
};

export const recruitSurvivor = (
	{ partyId, type }: { partyId: PartyId; type: Survivor },
	socketId: SocketId
) => {
	if (!(type in Survivor)) {
		ClientNotifier.error(
			`"${type}" is not a valid Survivor type.`,
			socketId
		);
		return;
	}

	const party = this.validatePartyForActivity(partyId);
	if (party === null) {
		return;
	}

	if (party.getSurvivors().length >= this.maxPartySize) {
		ClientNotifier.error(
			`Party "${party.name}" can't do this because it is already at the limit of ${this.maxPartySize} survivors.`,
			party.getUpdateRoomName()
		);

		return null;
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
		`There are no available ${type} in settlement "${settlement.name}".`,
		party.getUpdateRoomName()
	);
};

export const dismissSurvivor = (
	{ partyId, type }: { partyId: PartyId; type: Survivor },
	socketId: SocketId
) => {
	if (!(type in Survivor)) {
		ClientNotifier.error(
			`"${type}" is not a valid Survivor type.`,
			socketId
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
};
