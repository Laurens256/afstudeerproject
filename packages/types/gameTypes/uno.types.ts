export type UnoColor = 'red' | 'yellow' | 'green' | 'blue';
export type UnoNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type UnoNumberCard = {
	type: 'number-card';
	color: UnoColor;
	value: UnoNumber;
};
export type UnoSpecialColorCards = {
	type: 'special-card';
	color: UnoColor;
	value: 'skip' | 'reverse' | 'draw-two';
};
export type UnoWildCards = {
	type: 'wild-card';
	value: 'wild' | 'wild-draw-four';
};
export type UnoCard =  { cardId: number } & (UnoNumberCard | UnoSpecialColorCards | UnoWildCards);
export type UnoPlayer = {
	socketId: string;
	cards: UnoCard[];
};

export type UnoGameState = {
	drawPile: UnoCard[];
	droppedPile: UnoCard[];
	players: UnoPlayer[];
	currentPlayerId: string;
	currentCard: UnoCard;
	isClockwise: boolean;
	wildcardColor: UnoColor | null;
	cardDrawCounter: number;
	connectedPlayerSockets: string[];
};
