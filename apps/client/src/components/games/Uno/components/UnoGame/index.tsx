import type { Player, UnoCard, UnoGameState, UnoPlayer } from '@shared/types';
import clsx from 'clsx';
import socket from '@/socket';
import { CardsList, CenterSection, OpponentCardsList } from './components';
import classes from './UnoGame.module.css';
import { useColorPicker } from './hooks';

type UnoGameProps = {
	gameState: UnoGameState;
	players: Player[];
	ourPlayer: Player;
	canDoAction: boolean;
	disableCanDoAction: () => void;
	canSkipTurn: boolean;
	setHasDrawnCard: (hasDrawn: boolean) => void;
	hasDrawnCard: boolean;
};

const UnoGame = ({
	gameState,
	players,
	ourPlayer,
	canDoAction,
	disableCanDoAction,
	canSkipTurn,
	setHasDrawnCard,
	hasDrawnCard,
}: UnoGameProps) => {
	const [getColorFromPicker, ColorPicker] = useColorPicker();

	const setCorrectPlayerOrder = (playersArr: UnoPlayer[], ourPlayerId: string) => {
		const ourPlayerIndex = playersArr.findIndex((player) => player.socketId === ourPlayerId);
		const playersCopy = [...playersArr];
		const playersBefore = playersCopy.splice(0, ourPlayerIndex);
		return [...playersCopy, ...playersBefore];
	};

	const sortedPlayers = setCorrectPlayerOrder(gameState.players, ourPlayer.socketId);

	const canPlayCard = (card: UnoCard) => {
		let canPlay: boolean | string = true;

		const { currentCard, wildcardColor, cardDrawCounter } = gameState;
		const cards = gameState.players.find((p) => p.socketId === ourPlayer.socketId)?.cards || [];

		if (!canDoAction) {
			canPlay = 'It\'s not your turn';
		} else if (
			card.type === 'wild-card'
			&& cards.length === 1
		) {
			canPlay = 'You can\'t play a wild card when you have only one card left';
		} else if (cardDrawCounter > 0) {
			if (card.value !== 'draw-two'
			&& card.value !== 'wild-draw-four') {
				canPlay = 'You can only play a draw two or draw four card';
			}
		} else if (
			card.type === 'number-card'
		|| card.type === 'special-card'
		) {
			const { type: currentCardType, value: currentCardValue } = currentCard;
			const { color: cardColor, value: cardValue } = card;
			if (currentCardType === 'wild-card') {
				if (wildcardColor !== cardColor) {
					canPlay = `Can't play a ${cardColor} card. Chosen color is: ${wildcardColor}`;
				}
			} else if (
				cardColor !== currentCard.color
				&& cardValue !== currentCardValue
			) {
				canPlay = `You can't play a card that doesn't match the current card's color or value. Current card: ${currentCard.color} ${currentCard.value}`;
			}
		}

		return canPlay;
	};

	const isColorSelectCard = (card: UnoCard) => card.type === 'wild-card' && card.value === 'wild';
	const onPlayCard = async (card: UnoCard) => {
		const canPlay = canPlayCard(card);

		if (canPlay === true) {
			socket.emit('UNO_PLAY_CARD', card.cardId);
			if (isColorSelectCard(card)) {
				const chosenColor = await getColorFromPicker();
				socket.emit('UNO_CHOOSE_COLOR', chosenColor);
			}
		} else {
			alert(canPlay);
		}
	};

	// divides the players into 4 sections: bottom, left, top, right.
	// bottom section is reserved for ourPlayer, rest is divided clockwise
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

	return (
		<div className={clsx(classes.container, classes[`players${players.length}`])}>
			<section className={classes.middleSection} aria-label="card pile">
				<CenterSection
					currentCard={gameState.currentCard}
					canDoAction={canDoAction}
					disableCanDoAction={disableCanDoAction}
					canSkipTurn={canSkipTurn}
					setHasDrawnCard={setHasDrawnCard}
					hasDrawnCard={hasDrawnCard}
					cardDrawCounter={gameState.cardDrawCounter}
					getColorFromPicker={getColorFromPicker}
				/>
			</section>

			{playersDividedBySection.map((playersPerPosition, i) => {
				const position = ['bottom', 'left', 'top', 'right'][i];
				return (
					<div
						key={position[i]}
						className={clsx(classes[`${position}Position`], classes.cardListContainer)}
					>
						{playersPerPosition.map((player) => {
							const isCurrentPlayer = gameState.currentPlayerId === player.socketId;
							const username = players.find(
								(p) => p.socketId === player.socketId,
							)?.username || 'someone';
							return (
								i === 0 ? (
									<CardsList
										key={player.socketId}
										cards={player.cards}
										username={username}
										isCurrentPlayer={isCurrentPlayer}
										onCardClick={onPlayCard}
									/>
								) : (
									<OpponentCardsList
										key={player.socketId}
										isCurrentPlayer={isCurrentPlayer}
										cards={player.cards}
										username={username}
									/>
								)
							);
						})}
					</div>
				);
			})}

			<ColorPicker />
		</div>
	);
};

export default UnoGame;
