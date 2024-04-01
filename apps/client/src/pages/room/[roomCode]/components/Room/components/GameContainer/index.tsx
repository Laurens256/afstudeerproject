import { Uno } from '@/components/games';
import type { GamesType, Player } from '@shared/types';
import clsx from 'clsx';
import { GameErrorToastProvider } from '@/components';
import classes from './GameContainer.module.css';

type GameContainerProps = {
	game: GamesType;
	playersInGame: Player[];
};
const GameContainer = ({ game, playersInGame }: GameContainerProps) => (
	<main className={clsx(classes.container, classes[game])}>
		<GameErrorToastProvider>
			{(createToast) => (
				<>
					{game === 'UNO' && <Uno playersInGame={playersInGame} showErrorToast={createToast} />}
				</>
			)}
		</GameErrorToastProvider>
	</main>
);

export default GameContainer;
