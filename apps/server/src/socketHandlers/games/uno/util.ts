import type { UnoCard, UnoColor, UnoNumber, UnoSpecialColorCard, UnoWildCard, UnoGameState } from '@shared/types';
import { arrayUtil } from '@/util';

const games: { [roomCode: string]: UnoGameState } = {};

const generateDeck = (): UnoCard[] => {
	const colorVals: UnoColor[] = ['red', 'blue', 'green', 'yellow'];
	const numberVals: UnoNumber[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	const specialCardVals: UnoSpecialColorCard['value'][] = ['skip', 'reverse', 'draw-two'];
	const wildCardVals: UnoWildCard['value'][] = ['wild', 'wild-draw-four'];

	let cardIndex = 0;
	const numberCards: UnoCard[] = colorVals.flatMap((color) => numberVals.flatMap((value) => {
		const cards: UnoCard[] = [];
		for (let i = 0; i < (value === 0 ? 1 : 2); i++) {
			cards.push({ cardId: cardIndex++, type: 'number-card', color, value });
		}
		return cards;
	}));

	const specialCards: UnoCard[] = colorVals.flatMap((color) => specialCardVals.flatMap(
		(value) => {
			const cards: UnoCard[] = [];
			for (let i = 0; i < 2; i++) {
				cards.push({ cardId: cardIndex++, type: 'special-card', color, value });
			}
			return cards;
		},
	));

	const wildCards: UnoCard[] = wildCardVals.flatMap((value) => {
		const cards: UnoCard[] = [];
		for (let i = 0; i < 4; i++) {
			cards.push({ cardId: cardIndex++, type: 'wild-card', value });
		}
		return cards;
	});

	// return [...wildCards, ...wildCards, ...wildCards, ...wildCards];
	return arrayUtil.shuffleArray([...wildCards, ...specialCards, ...numberCards]);
};

// TODO check if enough cards are in deck
const drawCards = (roomCode: string, socketId: string, numCards: number) => {
	const game = games[roomCode];
	const { drawPile } = game;
	const cards = drawPile.splice(0, numCards);

	const player = game.players.find((p) => p.socketId === socketId);
	if (player) {
		player.cards.push(...cards);
	}
	return cards;
};

const setNextPlayer = (roomCode: string, skipPlayer?: boolean) => {
	const game = games[roomCode];
	const { players, currentPlayerId, isClockwise } = game;

	const currentPlayerIndex = players.findIndex((p) => p.socketId === currentPlayerId);
	const moveAmount = skipPlayer ? 2 : 1;

	const nextPlayerIndex = isClockwise
		? (currentPlayerIndex + moveAmount) % players.length
		: (currentPlayerIndex - moveAmount + players.length) % players.length;

	const { socketId: nextPlayerSocketId } = players[nextPlayerIndex];
	game.currentPlayerId = nextPlayerSocketId;
	return nextPlayerSocketId;
};

type PlayCardProps = {
	roomCode: string;
	socketId: string;
	cardId: number;
	chosenColor: UnoColor | null;
	skipNextPlayer: boolean | undefined;
};
const playCard = ({ roomCode, socketId, cardId, chosenColor, skipNextPlayer }: PlayCardProps) => {
	const game = games[roomCode];
	const player = game.players.find((p) => p.socketId === socketId);
	if (!player) return;

	const cardIndex = player.cards.findIndex((c) => c.cardId === cardId);
	if (cardIndex === -1) return;

	const card = player.cards[cardIndex];
	player.cards.splice(cardIndex, 1);

	let newCardDrawCounter = game.cardDrawCounter;
	if (card.type === 'special-card' && card.value === 'draw-two') {
		newCardDrawCounter += 2;
	} else if (card.type === 'wild-card' && card.value === 'wild-draw-four') {
		newCardDrawCounter += 4;
	}
	const newState: Partial<UnoGameState> = {
		droppedPile: [...game.droppedPile, card],
		currentCard: card,
		wildcardColor: chosenColor,
		isClockwise: card.type === 'special-card' && card.value === 'reverse' ? !game.isClockwise : game.isClockwise,
		cardDrawCounter: newCardDrawCounter,
	};

	// set newState before setting next player because direction or skip might change
	games[roomCode] = { ...game, ...newState };
	const nextPlayerId = setNextPlayer(roomCode, skipNextPlayer);
	newState.currentPlayerId = nextPlayerId;

	return newState;
};

const initializeGame = (roomCode: string, sockets: string[]) => {
	const deck = generateDeck();
	const startingCard = deck.find((card) => card.type === 'number-card') as UnoCard;
	deck.splice(deck.indexOf(startingCard), 1);

	const game: UnoGameState = {
		drawPile: deck,
		droppedPile: [],
		players: sockets.map((socketId) => ({
			socketId,
			cards: deck.splice(0, 7),
		})),
		currentPlayerId: sockets[0],
		currentCard: startingCard,
		isClockwise: true,
		wildcardColor: null,
		cardDrawCounter: 0,
		connectedPlayerSockets: [],
	};

	games[roomCode] = game;
	return game;
};

const handlePlayerLeave = (roomCode: string, socketId: string) => {
	const game = games[roomCode];
	if (!game) return;

	const playerIndex = game.players.findIndex((p) => p.socketId === socketId);
	if (playerIndex === -1) return;

	game.players.splice(playerIndex, 1);

	if (game.players.length === 0) {
		delete games[roomCode];
		return;
	}

	if (game.currentPlayerId === socketId) {
		setNextPlayer(roomCode);
	}
};

const setSocketConnected = (roomCode: string, socketId: string) => {
	const game = games[roomCode];
	if (!game) return;

	game.connectedPlayerSockets.push(socketId);
};

const getGame = (roomCode: string) => games[roomCode];

export default {
	drawCards,
	initializeGame,
	getGame,
	setNextPlayer,
	playCard,
	handlePlayerLeave,
	setSocketConnected,
};