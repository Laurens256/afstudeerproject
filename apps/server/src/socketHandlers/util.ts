import type { ExtendedServer } from '@/types';
import type { Player } from '@shared/types';

const getRoomSockets = (io: ExtendedServer, roomCode: string) => Array.from(
	io.sockets.adapter.rooms.get(roomCode) || [],
);

const getRoomPlayers = (io: ExtendedServer, roomCode: string) => {
	const socketsInRoom = getRoomSockets(io, roomCode);
	const dataObjects: (Player | null)[] = socketsInRoom.map((id) => {
		const { username, role, inGame } = io.sockets.sockets.get(id)?.data || {};

		if (username && role) {
			return {
				socketId: id,
				username,
				role,
				inGame: inGame || null,
			};
		}
		return null;
	});
	return dataObjects.filter(
		(p) => p !== null,
	) as Player[];
};

export default {
	getRoomSockets,
	getRoomPlayers,
};
