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
		const error = util.joinRoom(roomCode, socket.id, username);
		socket.emit(SocketRoomEvents.JOIN, error);
	});

	// socket.on('ROOM:join', (roomCode: string) => {
	// 	const success = util.joinRoom(roomCode, socket.id);
	// 	socket.emit('ROOM:join', success ? roomCode : null);
	// });

	socket.on(SocketRoomEvents.LEAVE, (roomCode: string) => {
		util.leaveRoom(socket.id, roomCode);
	});

	socket.on('disconnect', () => {
		util.leaveRoom(socket.id, null);
	});
};

export default roomHandlers;
