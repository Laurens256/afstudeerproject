type Players = {
	[socketId: string]: {
		name: string;
		role: 'admin' | 'player';
	};
};
type Rooms = {
	[roomCode: string]: {
		players: Players;
		// TODO: Add game type
		currentGame: string;
	};
};
const rooms: Rooms = {};

const generateRoomCode = () => {
	const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
	const charsLength = chars.length;

	let code = '';
	for (let i = 0; i < 6; i++) {
		code += chars[Math.floor(Math.random() * charsLength)];
	}
	return code.toUpperCase();
};

const createRoom = (): string => {
	const roomCode = generateRoomCode();

	if (rooms[roomCode]) {
		return createRoom();
	}

	rooms[roomCode] = {
		players: {},
		currentGame: '',
	};
	return roomCode;
};

const getSocketsInRoom = (inputCode: string) => {
	const roomCode = inputCode.toUpperCase();
	const room = rooms[roomCode];
	if (!room) {
		return [];
	}
	return Object.keys(room.players);
};

/**
 * @returns null if successful, error message if not
 * */
const joinRoom = (inputCode: string, socketId: string, inputname: string) => {
	const roomCode = inputCode.toUpperCase();
	const username = inputname.trim();

	if (!rooms[roomCode]) {
		return 'Room does not exist';
	}
	if (username.length < 2) {
		return 'Username must be at least 2 characters';
	}
	if (username.length > 20) {
		return 'Username can\'t be longer than 20 characters';
	}
	if (Object.values(rooms[roomCode].players).find((player) => player.name === username)) {
		return 'Username already taken';
	}
	rooms[roomCode].players[socketId] = {
		name: username,
		role: getSocketsInRoom(roomCode).length === 0 ? 'admin' : 'player',
	};

	return null;
};

// delete room if no players for 10 seconds, prevents room deletion on reload
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

const leaveRoom = (socketId: string, inputCode: string | null) => {
	const roomCodesToLeave = inputCode ? [inputCode.toUpperCase()] : Object.keys(rooms);
	roomCodesToLeave.forEach((code) => {
		delete rooms[code]?.players[socketId];
		handleRoomDelete(code);
	});
};

const roomExists = (inputCode: string) => {
	const roomCode = inputCode.toUpperCase();
	return !!rooms[roomCode];
};

export default {
	createRoom,
	joinRoom,
	leaveRoom,
	getSocketsInRoom,
	roomExists,
};
