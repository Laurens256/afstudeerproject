import type { Player, UnoCard, UnoGameState } from '@shared/types';
import clsx from 'clsx';
import socket from '@/socket';
import { memo, useRef } from 'react';
import type { GameErrorToastProps } from '@/types';
import { CardsList, CenterSection, OpponentCardsList, SpecialCardsLayer, CardAnimation } from './components';
import classes from './UnoGame.module.css';
import { useColorPicker } from './hooks';
import { dividePlayersBySection, canPlayCard } from './util';

const POSITIONS = ['bottom', 'left', 'top', 'right'];
type UnoGameProps = {
	gameState: UnoGameState;
	players: Player[];
	ourPlayer: Player | null;
	canDoAction: boolean;
	disableCanDoAction: () => void;
	canSkipTurn: boolean;
	setHasDrawnCard: (hasDrawn: boolean) => void;
	hasDrawnCard: boolean;
	currentPlayerUsername: string;
	showErrorToast: (props: GameErrorToastProps) => void;
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
	currentPlayerUsername,
	showErrorToast,
}: UnoGameProps) => {
	const { playersDividedBySection, ourUnoPlayer } = dividePlayersBySection(
		gameState.players,
		ourPlayer ? ourPlayer.socketId : null,
	);
	const [getColorFromPicker, ColorPickerComponent] = useColorPicker(ourUnoPlayer?.cards);
	const cardPileRefs = useRef<{ [socketId: string]: HTMLDivElement }>({});
	const drawButtonRef = useRef<HTMLButtonElement>(null);
	const dropPileRef = useRef<HTMLDivElement>(null);

	const onPlayCard = async (card: UnoCard) => {
		const { error, canPlay } = canPlayCard({ card, ourPlayer, gameState, canDoAction });

		if (canPlay) {
			showErrorToast(null);
			const isColorSelectCard = card.type === 'wild-card' && card.value === 'wild';
			if (isColorSelectCard) {
				const chosenColor = await getColorFromPicker();
				socket.emit('UNO_PLAY_CARD', card.cardId, chosenColor);
				return;
			}
			socket.emit('UNO_PLAY_CARD', card.cardId);
		} else if (error) {
			showErrorToast({ message: error });
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
					showErrorToast={showErrorToast}
					drawButtonRef={drawButtonRef}
					dropPileRef={dropPileRef}
				/>
			</section>

			{playersDividedBySection.map((playersPerPosition, i) => {
				const position = POSITIONS[i];
				return (
					<div
						key={position}
						className={clsx(classes[`${position}Position`], classes.cardListContainer)}
					>
						{playersPerPosition.map((player) => {
							const isCurrentPlayer = gameState.currentPlayerId === player.socketId;
							const isOurPlayer = socket.id === player.socketId;
							const username = players.find(
								(p) => p.socketId === player.socketId,
							)?.username || 'someone';
							return (
								<div
									ref={(el) => {
										// eslint-disable-next-line no-param-reassign
										if (el) cardPileRefs.current[player.socketId] = el;
									}}
									key={player.socketId}
								>
									{isOurPlayer ? (
										<CardsList
											cards={player.cards}
											username={username}
											isOurTurn={isCurrentPlayer}
											onCardClick={onPlayCard}
											currentPlayerUsername={currentPlayerUsername}
										/>
									) : (
										<OpponentCardsList
											isCurrentPlayer={isCurrentPlayer}
											cards={player.cards}
											username={username}
										/>
									)}
								</div>
							);
						})}
					</div>
				);
			})}

			<SpecialCardsLayer
				currentCard={gameState.currentCard}
				isClockwise={gameState.isClockwise}
				chosenColor={gameState.wildcardColor}
			/>
			<CardAnimation
				players={gameState.players}
				drawButtonRef={drawButtonRef}
				cardPileRefs={cardPileRefs}
				dropPileRef={dropPileRef}
			/>
			<ColorPickerComponent />
		</div>
	);
};

export default memo(UnoGame);
