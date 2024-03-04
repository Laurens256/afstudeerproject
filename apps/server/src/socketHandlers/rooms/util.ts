type Player = {
	username: string;
	role: 'admin' | 'player';
};
type Rooms = {
	[roomCode: string]: {
		players: { [socketId: string]: Player };
		// TODO: Add game type
		currentGame: string;
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
		players: {},
		currentGame: '',
	};
	return roomCode;
};

const getPlayersInRoom = (inputCode: string) => {
	const roomCode = inputCode.toUpperCase();
	const room = rooms[roomCode];
	if (!room) {
		return [];
	}

	const playersArray = Object.keys(room.players).map((socketId) => ({
		socketId,
		...room.players[socketId],
	}));

	return playersArray;
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

	const player: Player = {
		username,
		role: getSocketsInRoom(roomCode).length === 0 ? 'admin' : 'player',
	};

	if (!error) {
		rooms[roomCode].players[socketId] = player;
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
	const players = getPlayersInRoom(roomCode);
	if (players.length === 0) {
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
	getPlayersInRoom,
	getPlayerBySocketId,
	getSocketsInRoom,
	roomExists,
	getAllRoomsClientIsIn,
	setRoomAdmin,
};
