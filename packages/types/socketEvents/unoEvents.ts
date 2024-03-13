import { UnoGameState } from '../gameTypes';
import { Player } from '../roomTypes';

export type ServerToClientUnoEvents = {
	UNO_GET_GAME_STATE: (gameState: UnoGameState) => void;
};

export type ClientToServerUnoEvents = {
	UNO_GET_GAME_STATE: () => void;
	UNO_INITIALIZE_GAME: (players: Player[]) => void;
};
