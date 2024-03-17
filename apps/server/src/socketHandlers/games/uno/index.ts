/* eslint no-param-reassign: 0 */

import type { ExtendedServer, ExtendedSocket } from '@/types';
import util from './util';

const unoHandlers = (io: ExtendedServer, socket: ExtendedSocket) => {
	socket.on('UNO_PLAYER_GET_INITIAL_STATE', (expectedSockets) => {
		const { roomCode } = socket.data;
		if (!roomCode) return;
		let game = util.getGame(roomCode);
		if (!game) {
			game = util.initializeGame(roomCode, expectedSockets);
		}
		util.setSocketConnected(roomCode, socket.id);

		const allConnectedSocketIds = game.connectedPlayerSockets;

		if (expectedSockets.every((id) => allConnectedSocketIds.includes(id))) {
			io.to(roomCode).emit('UNO_GET_GAME_STATE', game);
		}
	});

	socket.on('UNO_GET_GAME_STATE', () => {
		const { roomCode } = socket.data;
		if (roomCode) {
			const game = util.getGame(roomCode);
			if (!game) return;
			socket.emit('UNO_GET_GAME_STATE', game);
		}
	});

	socket.on('UNO_DRAW_CARDS', (amount) => {
		const { roomCode } = socket.data;
		if (roomCode) {
			const cards = util.drawCards(roomCode, socket.id, amount);
			io.to(roomCode).emit('UNO_DRAW_CARDS', socket.id, cards);
		}
	});

	socket.on('UNO_PLAY_CARD', (cardId) => {
		const { roomCode } = socket.data;
		if (roomCode) {
			const newState = util.playCard({ roomCode, socketId: socket.id, cardId });
			if (newState) {
				io.to(roomCode).emit('UNO_PLAY_CARD', socket.id, cardId, newState);
			}
		}
	});

	socket.on('UNO_CHOOSE_COLOR', (color) => {
		const { roomCode } = socket.data;
		if (roomCode) {
			util.chooseColor(roomCode, color);
			io.to(roomCode).emit('UNO_CHOOSE_COLOR', color);
		}
	});

	socket.on('UNO_SKIP_TURN', () => {
		const { roomCode } = socket.data;
		if (roomCode) {
			const nextPlayerSocketId = util.setNextPlayer(roomCode);
			io.to(roomCode).emit('UNO_SET_PLAYER_TURN', nextPlayerSocketId);
		}
	});
};

export default unoHandlers;
