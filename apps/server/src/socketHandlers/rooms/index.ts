import type { Server, Socket } from 'socket.io';
import type { Message, RoomState } from '@shared/types';
import { SocketRoomEvents } from '@shared/types';
import util from './util';

const roomHandlers = (io: Server, socket: Socket) => {
	socket.on(SocketRoomEvents.CREATE, () => {
		const roomCode = util.createRoom();
		socket.emit(SocketRoomEvents.CREATE, roomCode);
	});

	socket.on(SocketRoomEvents.ROOM_EXISTS, (roomCode: string) => {
		const roomExists = util.roomExists(roomCode);
		socket.emit(SocketRoomEvents.ROOM_EXISTS, roomExists ? roomCode : null);
	});

	socket.on(SocketRoomEvents.JOIN, (roomCode: string, username: string) => {
		const { player, error } = util.joinRoom(roomCode, socket.id, username);
		socket.emit(SocketRoomEvents.JOIN, player.username, error);

		if (error === null) {
			const socketsInRoom = util.getSocketsInRoom(roomCode);

			io.to(socketsInRoom).emit(
				SocketRoomEvents.PLAYER_JOINED,
				{ ...player, socketId: socket.id },
			);
		}
	});

	const emitNewAdmins = (roomCodes: string[]) => {
		roomCodes.forEach((roomCode) => {
			const newAdminId = util.setRoomAdmin(roomCode, null);
			const socketsInRoom = util.getSocketsInRoom(roomCode);

			if (newAdminId) {
				io.to(socketsInRoom).emit(SocketRoomEvents.ADMIN_CHANGE, newAdminId);
			}
		});
	};

	socket.on(SocketRoomEvents.LEAVE, (roomCode: string) => {
		const socketsInRoom = util.getSocketsInRoom(roomCode);
		io.to(socketsInRoom).except(socket.id).emit(SocketRoomEvents.PLAYER_LEFT, socket.id);

		const roomsNeedNewAdmin = util.leaveRoom(socket.id, roomCode);
		emitNewAdmins(roomsNeedNewAdmin);
	});

	socket.on(SocketRoomEvents.GET_ROOM_STATE, (roomCode: string) => {
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
			roomName: room.roomName,
			isPrivate: room.isPrivate,
			isStarted: room.isStarted,
			players,
		};

		socket.emit(SocketRoomEvents.GET_ROOM_STATE, roomState);
	});

	socket.on(SocketRoomEvents.SET_ROOM_STATE, (
		roomCode: string,
		roomState: Partial<RoomState>,
	) => {
		const { players: p, ...rest } = roomState;
		const newState = util.setRoomState(roomCode, rest);

		if (newState) {
			const { players: p2, ...newStateRest } = newState;
			const socketsInRoom = util.getSocketsInRoom(roomCode);
			io.to(socketsInRoom).emit(SocketRoomEvents.GET_ROOM_STATE, newStateRest);
		}
	});

	socket.on(SocketRoomEvents.CHAT_MESSAGE, (roomCode: string, text: string) => {
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

			io.to(socketsInRoom).emit(SocketRoomEvents.CHAT_MESSAGE, message);
		} else {
			console.warn('CHAT_MESSAGE: this should not happen');
		}
	});

	socket.on('disconnect', () => {
		const rooms = util.getAllRoomsClientIsIn(socket.id);

		rooms.forEach((roomCode) => {
			const socketsInRoom = util.getSocketsInRoom(roomCode);
			io.to(socketsInRoom).except(socket.id).emit(SocketRoomEvents.PLAYER_LEFT, socket.id);
		});

		const roomsNeedNewAdmin = util.leaveRoom(socket.id, null);
		emitNewAdmins(roomsNeedNewAdmin);
	});
};

export default roomHandlers;
