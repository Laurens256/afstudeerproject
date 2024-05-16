import { Games, type Player, type RoomState } from '@shared/types';

export type ServerPlayer = Omit<Player, 'socketId'>;
type Rooms = {
	[roomCode: string]: & Omit<RoomState, 'players' | 'socketsInGame'> & {
		playersCount: number;
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

type CreateRoomProps = {
	code?: string;
	maxPlayers?: number;
	isPrivate?: boolean;
};
const createRoom = ({ code, maxPlayers, isPrivate }: CreateRoomProps): string => {
	const roomCode = code || generateRoomCode();

	if (roomExists(roomCode)) {
		return createRoom({});
	}

	rooms[roomCode] = {
		roomName: null,
		isPrivate: isPrivate || false,
		isStarted: false,
		selectedGame: Games.UNO,
		playersCount: 0,
		maxPlayers: maxPlayers || 8,
	};
	return roomCode;
};

const getRoom = (roomCode: string) => rooms[roomCode];

const changePlayerCount = (roomCode: string, change: number) => {
	const room = getRoom(roomCode);
	if (!room) {
		return null;
	}

	room.playersCount += change;
	return room.playersCount;
};

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
	let room = getRoom(roomCode);

	if (!room) {
		createRoom({ code: roomCode });
	}
	room = getRoom(roomCode);

	if (username.length < 2) {
		error = 'Username must be at least 2 characters';
	}
	if (username.length > 20) {
		error = 'Username can\'t be longer than 20 characters';
	}
	if (room.playersCount >= room.maxPlayers) {
		error = 'Room is full';
	}

	if (!error && room.roomName === null) {
		room.roomName = `${username}'${username.endsWith('s') ? '' : 's'} Room`;
	}

	return { error, username, roomCode };
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
	changePlayerCount,
};
