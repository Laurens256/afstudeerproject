import type { Server, Socket } from 'socket.io';
import util from './util';

const roomHandlers = (io: Server, socket: Socket) => {
	socket.on('ROOM:create', () => {
		const roomCode = util.createRoom();
		socket.emit('ROOM:create', roomCode);
	});

	socket.on('ROOM:join', (roomCode: string) => {
		const success = util.joinRoom(roomCode, socket.id);
		socket.emit('ROOM:join', success ? roomCode : null);
	});

	socket.on('ROOM:leave', (roomCode: string) => {
		util.leaveRoom(socket.id, roomCode);
	});

	socket.on('test', (roomCode: string) => {
		const sockets = util.getSocketsInRoom(roomCode);
		io.to(sockets).except(socket.id).emit('test');
	});

	socket.on('disconnect', () => {
		util.leaveRoom(socket.id, null);
	});
};

export default roomHandlers;
