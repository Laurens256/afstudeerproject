import type { UnoGameState, UnoCard } from '../gameTypes';

export type ServerToClientUnoEvents = {
	UNO_GET_GAME_STATE: (gameState: UnoGameState) => void;
	UNO_DRAW_CARDS: (socketId: string, cards: UnoCard[], nextPlayerSocketId: string) => void;
	UNO_SET_PLAYER_TURN: (socketId: string) => void;
	UNO_PLAY_CARD: (socketId: string, cardId: number, updatedState: Partial<UnoGameState>) => void;
};

export type ClientToServerUnoEvents = {
	UNO_GET_GAME_STATE: () => void;
	UNO_PLAY_CARD: (cardId: number) => void;
	UNO_DRAW_CARDS: (amount: number) => void;
};
