import type { Player, UnoCard, UnoGameState, UnoPlayer } from '@shared/types';
import clsx from 'clsx';
import socket from '@/socket';
import { CardsList, CenterSection } from './components';
import classes from './UnoGame.module.css';

type UnoGameProps = {
	gameState: UnoGameState;
	players: Player[];
};

const UnoGame = ({ gameState, players }: UnoGameProps) => {
	const ourPlayer = players.find((player) => player.socketId === socket.id);
	const ourCards = gameState.players.find(
		(player) => player.socketId === ourPlayer?.socketId,
	)?.cards;

	if (!ourPlayer || !ourCards) {
		// TODO shouldn't happen, probably throw error here
		return <p>something bad happened :0</p>;
	}

	const setCorrectPlayerOrder = (playersArr: UnoPlayer[], ourPlayerId: string) => {
		const ourPlayerIndex = playersArr.findIndex((player) => player.socketId === ourPlayerId);
		const playersCopy = [...playersArr];
		const playersBefore = playersCopy.splice(0, ourPlayerIndex);
		return [...playersCopy, ...playersBefore];
	};

	const sortedPlayers = setCorrectPlayerOrder(gameState.players, ourPlayer.socketId);

	const onCardClick = (card: UnoCard) => {
		console.log(card);
	};

	return (
		<div className={clsx(classes.container, classes[`players${players.length}`])}>
			<section className={classes.middleSection} aria-label="card pile">
				<CenterSection currentCard={gameState.currentCard} />
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

				return (
					<div className={clsx(classes[`player${i + 1}`], classes.cardListContainer)}>
						<CardsList
							key={player.socketId}
							cards={player.cards}
							username={username}
							isVisible={isOurPlayer}
							currentCard={gameState.currentCard}
							wildcardColor={gameState.wildcardColor}
							onClick={isOurPlayer ? onCardClick : undefined}
							position={position}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default UnoGame;
