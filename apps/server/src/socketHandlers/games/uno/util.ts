import type { UnoCard, UnoColor, UnoNumber, UnoSpecialColorCards, UnoWildCards, UnoGameState, Player } from '@shared/types';
import { arrayUtil } from '@/util';

const games: { [roomCode: string]: UnoGameState } = {};

const generateDeck = (): UnoCard[] => {
	const colorVals: UnoColor[] = ['red', 'blue', 'green', 'yellow'];
	const numberVals: UnoNumber[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	const specialCardVals: UnoSpecialColorCards['value'][] = ['skip', 'reverse', 'draw-two'];
	const wildCardVals: UnoWildCards['value'][] = ['wild', 'draw-four'];

	const numberCards: UnoCard[] = colorVals.flatMap((color) => numberVals.flatMap((value) => {
		const card: UnoCard = { type: 'number-card', color, value: value as UnoNumber };
		if (value === 0) {
			return [card];
		}
		return [card, card];
	}));

	const specialCards: UnoCard[] = colorVals.flatMap((color) => specialCardVals.flatMap(
		(value) => {
			const card: UnoCard = { type: 'special-card', color, value };
			return [card, card];
		},
	));

	const wildCards: UnoCard[] = wildCardVals.flatMap((value) => {
		const card: UnoCard = { type: 'wild-card', value };
		return [card, card, card, card];
	});

	return arrayUtil.shuffleArray([...wildCards, ...specialCards, ...numberCards]);
};

// TODO check if enough cards are in deck
const drawCards = (roomCode: string, numCards: number): UnoCard[] => {
	const game = games[roomCode];
	const { drawPile } = game;
	const cards = drawPile.splice(0, numCards);
	return cards;
};

const initializeGame = (roomCode: string, players: Player[]) => {
	const deck = generateDeck();
	const startingCard = deck.find((card) => card.type === 'number-card') as UnoCard;
	const index = deck.indexOf(startingCard);
	deck.splice(index, 1);

	const game: UnoGameState = {
		drawPile: deck,
		droppedPile: [],
		players: players.map((p) => p.socketId).reduce((acc, playerId) => {
			acc[playerId] = {
				cards: deck.splice(0, 7),
			};
			return acc;
		}, {} as UnoGameState['players']),
		currentPlayerId: players[0].socketId,
		currentCard: startingCard,
	};

	games[roomCode] = game;
	return game;
};

const getGame = (roomCode: string) => games[roomCode];

export default {
	drawCards,
	initializeGame,
	getGame,
};
