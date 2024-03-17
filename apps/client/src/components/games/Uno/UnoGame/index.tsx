import type { Player, UnoCard, UnoGameState, UnoPlayer } from '@shared/types';
import clsx from 'clsx';
import socket from '@/socket';
import { CardsList, CenterSection } from './components';
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
			alert(canPlay); // TODO
		}
	};

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

			{sortedPlayers.map((player, i) => {
				let position: 'top' | 'right' | 'bottom' | 'left' = 'bottom';
				if (i === 1) position = players.length === 2 ? 'top' : 'left';
				if (i === 2) position = players.length === 3 ? 'right' : 'top';
				if (i === 3) position = 'right';

				const isOurPlayer = player.socketId === ourPlayer.socketId;
				const username = players.find(
					(p) => p.socketId === player.socketId,
				)?.username || 'someone';
				const isCurrentPlayer = gameState.currentPlayerId === player.socketId;

				return (
					<div
						key={player.socketId}
						className={clsx(classes[`${position}Position`], classes.cardListContainer)}
					>
						<CardsList
							cards={player.cards}
							username={username}
							position={position}
							isCurrentPlayer={isCurrentPlayer}
							onCardClick={isOurPlayer ? onPlayCard : undefined}
						/>
					</div>
				);
			})}
			<ColorPicker />
		</div>
	);
};

export default UnoGame;
