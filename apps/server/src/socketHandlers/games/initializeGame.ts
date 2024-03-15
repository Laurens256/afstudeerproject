import type { GamesType, Player } from '@shared/types';
import unoUtil from './uno/util';

const initializeGame = (roomCode: string, game: GamesType | null, players: Player[]) => {
	switch (game) {
		case 'uno':
			unoUtil.initializeGame(roomCode, players);
			break;
		default:
			return null;
	}
};

export default initializeGame;
