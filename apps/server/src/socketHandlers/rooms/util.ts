import { type Player, type RoomState } from '@shared/types';

export type ServerPlayer = Omit<Player, 'socketId'>;
type Rooms = {
	[roomCode: string]: & Omit<RoomState, 'players' | 'socketsInGame'> & {
	};
};
const rooms: Rooms = {};

const roomExists = (inputCode: string) => {
	const roomCode = inputCode.toUpperCase();
	return !!rooms[roomCode];
};

const generateRoomCode = () => {
	const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
	const charsLength = chars.length;

	let code = '';
	for (let i = 0; i < 6; i++) {
		code += chars[Math.floor(Math.random() * charsLength)];
	}
	return code.toUpperCase();
};

const createRoom = (code?: string): string => {
	const roomCode = code || generateRoomCode();

	if (roomExists(roomCode)) {
		return createRoom();
	}

	rooms[roomCode] = {
		roomName: null,
		isPrivate: false,
		isStarted: false,
		selectedGame: 'uno', // TODO
	};
	return roomCode;
};

const getRoom = (roomCode: string) => rooms[roomCode];
const setRoomState = (roomCode: string, roomState: Partial<Omit<RoomState, 'players'>>) => {
	const room = rooms[roomCode];
	if (!room) {
		return null;
	}

	const mergedRoomState = {
		...room,
		...roomState,
	};
	rooms[roomCode] = mergedRoomState;
	return mergedRoomState;
};

const joinRoom = (inputCode: string, inputname: string) => {
	const roomCode = inputCode.toUpperCase();
	const username = inputname.trim();
	let error = null;

	if (!rooms[roomCode]) {
		createRoom(roomCode);
	}
	if (username.length < 2) {
		error = 'Username must be at least 2 characters';
	}
	if (username.length > 30) {
		error = 'Username can\'t be longer than 30 characters';
	}

	if (!error && rooms[roomCode].roomName === null) {
		rooms[roomCode].roomName = `${username}'${username.endsWith('s') ? '' : 's'} Room`;
	}

	return { error, username };
};

const deleteRoom = (roomCode: string) => {
	delete rooms[roomCode];
};

export default {
	createRoom,
	joinRoom,
	getRoom,
	setRoomState,
	roomExists,
	deleteRoom,
};
