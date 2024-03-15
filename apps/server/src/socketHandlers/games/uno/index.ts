import type { ExtendedServer, ExtendedSocket } from '@/types';
import type { UnoGameState } from '@shared/types';
import util from './util';

const unoHandlers = (io: ExtendedServer, socket: ExtendedSocket) => {
	socket.on('UNO_GET_GAME_STATE', () => {
		const { roomCode } = socket.data;
		if (roomCode) {
			const game = util.getGame(roomCode);
			socket.emit('UNO_GET_GAME_STATE', game);
		}
	});
	socket.on('UNO_DRAW_CARDS', (amount) => {
		const { roomCode } = socket.data;
		if (roomCode) {
			const cards = util.drawCards(roomCode, socket.id, amount);
			// TODO: wait for user to skip instead of auto skip after drawing
			const nextPlayerSocketId = util.setNextPlayer(roomCode);
			io.to(roomCode).emit('UNO_DRAW_CARDS', socket.id, cards, nextPlayerSocketId);
		}
	});
	socket.on('UNO_PLAY_CARD', (cardId) => {
		const { roomCode } = socket.data;
		if (roomCode) {
			const response = util.playCard(roomCode, socket.id, cardId);
			if (response) {
				const { newState, isChooseColorCard } = response;
				if (isChooseColorCard) {
					// TODO
					// socket.emit('UNO_CHOOSE_COLOR', socket.id);
				} else {
					const nextSocketId = util.setNextPlayer(roomCode);
					const newStateWithNextPlayer: Partial<UnoGameState> = {
						...newState, currentPlayerId: nextSocketId,
					};
					io.to(roomCode).emit('UNO_PLAY_CARD', socket.id, cardId, newStateWithNextPlayer);
					// io.to(roomCode).emit('UNO_UPDATE_GAME_STATE', newState);
					// handleEmitNextPlayer(roomCode);
				}
			}
		}
	});
};

export default unoHandlers;
