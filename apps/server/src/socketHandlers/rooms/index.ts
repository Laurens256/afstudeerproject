import type { Server, Socket } from 'socket.io';
import type { Message, Player } from '@shared/types';
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

	socket.on(SocketRoomEvents.GET_ALL_PLAYERS, (roomCode: string) => {
		const players = util.getPlayersInRoom(roomCode);
		socket.emit(SocketRoomEvents.GET_ALL_PLAYERS, players);
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
			io.to(socketsInRoom).except(socket.id).emit(SocketRoomEvents.CHAT_MESSAGE, message);
		} else {
			console.warn('Something happened that should not have happened :0');
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
