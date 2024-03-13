import type { ExtendedServer, ExtendedSocket } from '@/types';
import util from './util';

const unoHandlers = (io: ExtendedServer, socket: ExtendedSocket) => {
	socket.on('UNO_GET_GAME_STATE', () => {
		util.initializeGame('roomCode', ['player1', 'player2']);
	});
};

export default unoHandlers;
