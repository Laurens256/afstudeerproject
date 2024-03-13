import { Uno } from '@/components/games';
import type { GamesType } from '@shared/types';
import classes from './GameContainer.module.css';

type GameContainerProps = {
	game: GamesType;
	socketsInGame: string[];
};
const GameContainer = ({ game, socketsInGame }: GameContainerProps) => (
	<main className={classes.container}>
		{game === 'uno' && <Uno />}
	</main>
);

export default GameContainer;
