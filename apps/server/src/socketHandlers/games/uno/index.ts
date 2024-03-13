import type { ExtendedServer, ExtendedSocket } from '@/types';
import util from './util';

const unoHandlers = (io: ExtendedServer, socket: ExtendedSocket) => {
	socket.on('UNO_INITIALIZE_GAME', (players) => {
		const { roomCode } = socket.data;
		if (roomCode) {
			const game = util.initializeGame(roomCode, players);
			io.to(roomCode).emit('UNO_GET_GAME_STATE', game);
		}
	});
	socket.on('UNO_GET_GAME_STATE', () => {
		const { roomCode } = socket.data;
		if (roomCode) {
			const game = util.getGame(roomCode);
			socket.emit('UNO_GET_GAME_STATE', game);
		}
	});
};

export default unoHandlers;
