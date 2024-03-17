import type { UnoGameState, UnoCard, UnoColor } from '../gameTypes';

export type ServerToClientUnoEvents = {
	UNO_GET_GAME_STATE: (gameState: UnoGameState) => void;
	UNO_DRAW_CARDS: (socketId: string, cards: UnoCard[]) => void;
	UNO_SET_PLAYER_TURN: (socketId: string) => void;
	UNO_PLAY_CARD: (socketId: string, cardId: number, updatedState: Partial<UnoGameState>) => void;
};

export type ClientToServerUnoEvents = {
	UNO_PLAYER_GET_INITIAL_STATE: (expectedSockets: string[]) => void;
	UNO_GET_GAME_STATE: () => void;
	UNO_PLAY_CARD: (cardId: number, wildcardColor: UnoColor | null, skipNextPlayer: boolean) => void;
	UNO_DRAW_CARDS: (amount: number) => void;
	UNO_SKIP_TURN: () => void;
};
