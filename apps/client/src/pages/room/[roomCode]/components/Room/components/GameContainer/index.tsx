import { Uno } from '@/components/games';
import type { GamesType, Player } from '@shared/types';
import clsx from 'clsx';
import classes from './GameContainer.module.css';

type GameContainerProps = {
	game: GamesType;
	playersInGame: Player[];
};
const GameContainer = ({ game, playersInGame }: GameContainerProps) => (
	<main className={clsx(classes.container, classes[game])}>
		{game === 'UNO' && <Uno playersInGame={playersInGame} />}
	</main>
);

export default GameContainer;
