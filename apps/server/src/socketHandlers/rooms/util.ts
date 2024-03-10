import { type Player, type RoomState } from '@shared/types';

type ServerPlayer = Omit<Player, 'socketId'>;
type Rooms = {
	[roomCode: string]: & Omit<RoomState, 'players'> & {
		players: Record<string, ServerPlayer>;
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
		players: {},
		isPrivate: false,
		isStarted: false,
	};
	return roomCode;
};

const getRoom = (inputCode: string) => {
	const roomCode = inputCode.toUpperCase();
	return rooms[roomCode];
};
const setRoomState = (inputCode: string, roomState: Partial<Omit<RoomState, 'players'>>) => {
	const roomCode = inputCode.toUpperCase();
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

const getSocketsInRoom = (inputCode: string) => {
	const roomCode = inputCode.toUpperCase();
	const room = rooms[roomCode];
	if (!room) {
		return [];
	}

	return Object.keys(room.players);
};

const getPlayerBySocketId = (inputCode: string, socketId: string) => {
	const roomCode = inputCode.toUpperCase();
	const room = rooms[roomCode];
	if (!room) {
		return null;
	}

	return room.players[socketId];
};

/**
 * @returns null if successful, error message if not
 * */
const joinRoom = (inputCode: string, socketId: string, inputname: string) => {
	const roomCode = inputCode.toUpperCase();
	const username = inputname.trim();
	let error = null;

	if (!rooms[roomCode]) {
		createRoom(roomCode);
	}
	if (username.length < 2) {
		error = 'Username must be at least 2 characters';
	}
	if (username.length > 20) {
		error = 'Username can\'t be longer than 20 characters';
	}

	const player: ServerPlayer = {
		username,
		role: getSocketsInRoom(roomCode).length === 0 ? 'admin' : 'player',
	};

	if (!error) {
		rooms[roomCode].players[socketId] = player;

		if (rooms[roomCode].roomName === null) {
			rooms[roomCode].roomName = `${username}'${username.endsWith('s') ? '' : 's'} Room`;
		}
	}

	return { error, player };
};

// delete room if no players for 10 seconds, timer prevents room deletion on reload
const handleRoomDelete = (inputCode: string) => {
	const roomCode = inputCode.toUpperCase();
	if (getSocketsInRoom(roomCode).length === 0) {
		setTimeout(() => {
			if (getSocketsInRoom(roomCode).length === 0) {
				delete rooms[roomCode];
			}
		}, 10_000);
	}
};

const setRoomAdmin = (roomCode: string, socketId: string | null) => {
	const sockets = getSocketsInRoom(roomCode);
	if (sockets.length === 0) {
		return;
	}

	let newAdminId: string | null = null;

	Object.keys(rooms[roomCode].players).forEach((playerSocketId, i) => {
		if (i === 0 || (socketId && playerSocketId === socketId)) {
			rooms[roomCode].players[playerSocketId].role = 'admin';
			newAdminId = playerSocketId;
		} else {
			rooms[roomCode].players[playerSocketId].role = 'player';
		}
	});

	return newAdminId;
};

/**
 * @returns array of room codes that need a new admin
 * */
const leaveRoom = (socketId: string, inputCode: string | null) => {
	const roomCodesToLeave = inputCode ? [inputCode.toUpperCase()] : Object.keys(rooms);
	const roomsNeedNewAdmin: string[] = [];
	roomCodesToLeave.forEach((code) => {
		const isAdmin = rooms[code]?.players[socketId]?.role === 'admin';
		if (isAdmin) {
			roomsNeedNewAdmin.push(code);
		}
		delete rooms[code]?.players[socketId];
		handleRoomDelete(code);
	});

	return roomsNeedNewAdmin;
};

const getAllRoomsClientIsIn = (socketId: string) => {
	const roomsClientIsIn: string[] = [];
	Object.entries(rooms).forEach(([roomCode, room]) => {
		if (room.players[socketId]) {
			roomsClientIsIn.push(roomCode);
		}
	});
	return roomsClientIsIn;
};

export default {
	createRoom,
	joinRoom,
	leaveRoom,
	getRoom,
	setRoomState,
	getPlayerBySocketId,
	getSocketsInRoom,
	roomExists,
	getAllRoomsClientIsIn,
	setRoomAdmin,
};
