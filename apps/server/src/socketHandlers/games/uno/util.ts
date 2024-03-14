import type { UnoCard, UnoColor, UnoNumber, UnoSpecialColorCards, UnoWildCards, UnoGameState, Player } from '@shared/types';
import { arrayUtil } from '@/util';

const games: { [roomCode: string]: UnoGameState } = {};

const generateDeck = (): UnoCard[] => {
	const colorVals: UnoColor[] = ['red', 'blue', 'green', 'yellow'];
	const numberVals: UnoNumber[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	const specialCardVals: UnoSpecialColorCards['value'][] = ['skip', 'reverse', 'draw-two'];
	const wildCardVals: UnoWildCards['value'][] = ['wild', 'wild-draw-four'];

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
	deck.splice(deck.indexOf(startingCard), 1);

	const game: UnoGameState = {
		drawPile: deck,
		droppedPile: [],
		players: players.map((p) => ({
			socketId: p.socketId,
			cards: deck.splice(0, 7),
		})),
		currentPlayerId: players[0].socketId,
		currentCard: startingCard,
		isClockwise: true,
		wildcardColor: null,
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
