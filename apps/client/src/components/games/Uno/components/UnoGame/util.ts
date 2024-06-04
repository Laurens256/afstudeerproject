import type { Player, UnoCard, UnoGameState, UnoPlayer } from '@shared/types';

/**
 * @description sorts players so our player is always first
 * If our playerId is null, the order doesn't matter since we're a spectator
* */
const setCorrectPlayerOrder = (playersArr: UnoPlayer[], ourPlayerId: string | null) => {
	if (!ourPlayerId) return playersArr;

	const ourPlayerIndex = playersArr.findIndex((player) => player.socketId === ourPlayerId);
	const playersCopy = [...playersArr];
	const playersBefore = playersCopy.splice(0, ourPlayerIndex);
	return [...playersCopy, ...playersBefore];
};

// divides the players into 4 sections: bottom, left, top, right.
// bottom section is reserved for ourPlayer, rest is divided clockwise
const dividePlayersBySection = (
	players: UnoPlayer[],
	ourPlayerId: string | null,
) => {
	const sortedPlayers = setCorrectPlayerOrder(players, ourPlayerId);

	const playersDividedBySection: UnoPlayer[][] = [[sortedPlayers[0]]];

	if (sortedPlayers.length === 2) {
		playersDividedBySection.push([], [sortedPlayers[1]]);
	} else if (sortedPlayers.length === 3) {
		playersDividedBySection.push([sortedPlayers[1]], [], [sortedPlayers[2]]);
	} else {
		const playersPerSection = Math.ceil((sortedPlayers.length - 1) / 3);
		playersDividedBySection.push(...Array.from({ length: 3 }, (_, sectionIndex) => {
			const startIndex = 1 + sectionIndex * playersPerSection;
			const endIndex = Math.min(startIndex + playersPerSection, sortedPlayers.length);
			return sortedPlayers.slice(startIndex, endIndex);
		}));
	}

	return { playersDividedBySection, ourUnoPlayer: sortedPlayers[0] };
};

type CanPlayCardProps = {
	card: UnoCard;
	ourPlayer: Player | null;
	gameState: UnoGameState;
	canDoAction: boolean;
};
const canPlayCard = ({ card, ourPlayer, gameState, canDoAction }:CanPlayCardProps) => {
	if (!ourPlayer) {
		return { error: 'You are not in this game', canPlay: false };
	}
	let error: string | null = null;

	const { currentCard, wildcardColor, cardDrawCounter } = gameState;
	const cards = gameState.players.find((p) => p.socketId === ourPlayer.socketId)?.cards || [];

	if (!canDoAction) {
		error = 'It\'s not your turn';
	} else if (
		(card.type === 'wild-card' || card.type === 'special-card')
		&& cards.length === 1
	) {
		error = 'Your final card can\'t be a special card';
	} else if (cardDrawCounter > 0) {
		if (card.value !== 'draw-two'
		&& card.value !== 'wild-draw-four') {
			error = 'You can only play a draw two or draw four card';
		}
	} else if (
		card.type === 'number-card'
	|| card.type === 'special-card'
	) {
		const { type: currentCardType, value: currentCardValue } = currentCard;
		const { color: cardColor, value: cardValue } = card;
		if (currentCardType === 'wild-card') {
			if (wildcardColor !== cardColor) {
				error = `Can't play a ${cardColor} card. Chosen color is: ${wildcardColor}`;
			}
		} else if (
			cardColor !== currentCard.color
			&& cardValue !== currentCardValue
		) {
			error = `Can't play a ${cardColor} ${cardValue} card on a ${currentCard.color} ${currentCard.value} card`;
		}
	}

	return { error, canPlay: error === null };
};

export { dividePlayersBySection, canPlayCard };
