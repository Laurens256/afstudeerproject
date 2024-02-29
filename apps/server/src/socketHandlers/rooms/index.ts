import type { Server, Socket } from 'socket.io';
import { SocketRoomEvents } from '@shared/types';
import util from './util';

const roomHandlers = (io: Server, socket: Socket) => {
	socket.on(SocketRoomEvents.CREATE, () => {
		const roomCode = util.createRoom();
		socket.emit(SocketRoomEvents.CREATE, roomCode);
	});

	socket.on(SocketRoomEvents.CONNECT, (roomCode: string) => {
		const roomExists = util.roomExists(roomCode);
		socket.emit(SocketRoomEvents.CONNECT, roomExists ? roomCode : null);
	});

	socket.on(SocketRoomEvents.JOIN, (roomCode: string, username: string) => {
		const { player, error } = util.joinRoom(roomCode, socket.id, username);
		socket.emit(SocketRoomEvents.JOIN, error);

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

	socket.on('disconnect', () => {
		const rooms = util.getAllRoomsClientIsIn(socket.id);
		io.to(rooms).except(socket.id).emit(SocketRoomEvents.PLAYER_LEFT, socket.id);

		const roomsNeedNewAdmin = util.leaveRoom(socket.id, null);
		emitNewAdmins(roomsNeedNewAdmin);
	});
};

export default roomHandlers;
