import { Uno } from '@/components/games';
import { Games, type GamesType, type Player } from '@shared/types';
import clsx from 'clsx';
import { GameErrorToastProvider } from '@/components';
import classes from './GameContainer.module.css';
import { SpectatorDialog, GameRules } from './components';

type GameContainerProps = {
	game: GamesType;
	playersInGame: Player[];
	isSpectator: boolean;
};
const GameContainer = ({ game, playersInGame, isSpectator }: GameContainerProps) => (
	<main className={clsx(classes.container, classes[game.toLowerCase().replace(' ', '-')])}>
		<SpectatorDialog
			isSpectator={isSpectator}
			game={game}
			playersAmount={playersInGame.length}
		/>
		<GameRules game={game} />
		<GameErrorToastProvider>
			{(createToast) => (
				<>
					{game === Games.UNO && (
						<Uno playersInGame={playersInGame} showErrorToast={createToast} />
					)}
				</>
			)}
		</GameErrorToastProvider>
	</main>
);

export default GameContainer;
