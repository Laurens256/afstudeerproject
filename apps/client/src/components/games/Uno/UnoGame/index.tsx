import type { Player, UnoGameState, UnoPlayer } from '@shared/types';
import clsx from 'clsx';
import { CardsList, CenterSection } from './components';
import classes from './UnoGame.module.css';

type UnoGameProps = {
	gameState: UnoGameState;
	players: Player[];
	ourPlayer: Player;
	canDoAction: boolean;
	disableCanDoAction: () => void;
};

const UnoGame = ({
	gameState, players, ourPlayer, canDoAction, disableCanDoAction,
}: UnoGameProps) => {
	const setCorrectPlayerOrder = (playersArr: UnoPlayer[], ourPlayerId: string) => {
		const ourPlayerIndex = playersArr.findIndex((player) => player.socketId === ourPlayerId);
		const playersCopy = [...playersArr];
		const playersBefore = playersCopy.splice(0, ourPlayerIndex);
		return [...playersCopy, ...playersBefore];
	};

	const sortedPlayers = setCorrectPlayerOrder(gameState.players, ourPlayer.socketId);

	return (
		<div className={clsx(classes.container, classes[`players${players.length}`])}>
			<section className={classes.middleSection} aria-label="card pile">
				<CenterSection
					currentCard={gameState.currentCard}
					canDoAction={canDoAction}
					disableCanDoAction={disableCanDoAction}
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
							isVisible={isOurPlayer}
							currentCard={gameState.currentCard}
							wildcardColor={gameState.wildcardColor}
							position={position}
							canDoAction={canDoAction}
							disableCanDoAction={disableCanDoAction}
							isCurrentPlayer={isCurrentPlayer}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default UnoGame;
