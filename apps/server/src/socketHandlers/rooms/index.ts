import type { Server, Socket } from 'socket.io';
import type { Message, RoomState, ClientToServerEvents, ServerToClientEvents } from '@shared/types';
import util from './util';

// TODO move to types
type ExtendedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
type ExtendedServer = Server<ClientToServerEvents, ServerToClientEvents>;

const roomHandlers = (io: ExtendedServer, socket: ExtendedSocket) => {
	socket.on('ROOM_CREATE', () => {
		const roomCode = util.createRoom();
		socket.emit('ROOM_CREATE', roomCode);
	});

	socket.on('ROOM_EXISTS', (roomCode) => {
		const roomExists = util.roomExists(roomCode);
		socket.emit('ROOM_EXISTS', roomExists ? roomCode : null);
	});

	socket.on('ROOM_JOIN', (roomCode, username) => {
		const { player, error } = util.joinRoom(roomCode, socket.id, username);
		socket.emit('ROOM_JOIN', player.username, error);

		if (error === null) {
			const socketsInRoom = util.getSocketsInRoom(roomCode);

			io.to(socketsInRoom).emit('ROOM_PLAYER_JOINED', { socketId: socket.id, ...player });
		}
	});

	const emitNewAdmins = (roomCodes: string[]) => {
		roomCodes.forEach((roomCode) => {
			const newAdminId = util.setRoomAdmin(roomCode, null);
			const sockets = util.getSocketsInRoom(roomCode);

			if (newAdminId) {
				io.to(sockets).emit('ROOM_ADMIN_CHANGE', newAdminId);
			}
		});
	};

	socket.on('ROOM_LEAVE', (roomCode: string) => {
		const sockets = util.getSocketsInRoom(roomCode);
		io.to(sockets).except(socket.id).emit('ROOM_PLAYER_LEFT', socket.id); // TODO

		const roomsNeedNewAdmin = util.leaveRoom(socket.id, roomCode);
		emitNewAdmins(roomsNeedNewAdmin);
	});

	socket.on('ROOM_GET_STATE', (roomCode) => {
		const room = util.getRoom(roomCode);

		if (!room) {
			console.warn('GET_ROOM_STATE: this should not happen');
			return;
		}

		const players = Object.keys(room.players).map((socketId) => ({
			socketId,
			...room.players[socketId],
		}));

		const roomState: RoomState = {
			...room,
			players,
		};

		socket.emit('ROOM_SET_STATE', roomState);
	});

	socket.on('ROOM_SET_STATE', (roomCode, roomState) => {
		const { players: p, ...rest } = roomState;
		const newState = util.setRoomState(roomCode, rest);

		if (newState) {
			const { players: p2, ...newStateRest } = newState;
			const socketsInRoom = util.getSocketsInRoom(roomCode);
			io.to(socketsInRoom).emit('ROOM_SET_STATE', newStateRest); // TODO
		}
	});

	socket.on('ROOM_CHAT_MESSAGE', (roomCode: string, text: string) => {
		const socketsInRoom = util.getSocketsInRoom(roomCode);
		const player = util.getPlayerBySocketId(roomCode, socket.id);

		if (player) {
			const message: Message = {
				messageId: crypto.randomUUID(),
				type: 'user',
				socketId: socket.id,
				username: player.username,
				text,
				date: new Date(),
			};

			io.to(socketsInRoom).emit('ROOM_CHAT_MESSAGE', message);
		} else {
			console.warn('CHAT_MESSAGE: this should not happen');
		}
	});

	socket.on('disconnect', () => {
		const rooms = util.getAllRoomsClientIsIn(socket.id);

		rooms.forEach((roomCode) => {
			const sockets = util.getSocketsInRoom(roomCode);
			io.to(sockets).emit('ROOM_PLAYER_LEFT', socket.id);
		});

		const roomsNeedNewAdmin = util.leaveRoom(socket.id, null);
		emitNewAdmins(roomsNeedNewAdmin);
	});
};

export default roomHandlers;
