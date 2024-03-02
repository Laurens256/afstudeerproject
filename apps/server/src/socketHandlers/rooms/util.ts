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

// TODO: playerName
const joinRoom = (inputCode: string, socketId: string, playerName = 'Bertus') => {
	const roomCode = inputCode.toUpperCase();
	if (!rooms[roomCode]) {
		return false;
	}
	rooms[roomCode].players[socketId] = {
		name: playerName,
		role: getSocketsInRoom(roomCode).length === 0 ? 'admin' : 'player',
	};
	return true;
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

export default {
	createRoom,
	joinRoom,
	leaveRoom,
	getSocketsInRoom,
};
