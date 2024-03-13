import { UnoGameState } from '../gameTypes';

export type ServerToClientUnoEvents = {
	UNO_GET_GAME_STATE: (gameState: UnoGameState) => void;
};

export type ClientToServerUnoEvents = {
	UNO_GET_GAME_STATE: () => void;
};