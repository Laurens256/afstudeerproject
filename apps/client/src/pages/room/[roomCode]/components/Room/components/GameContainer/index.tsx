import { Uno } from '@/components/games';
import type { GamesType, Player } from '@shared/types';
import classes from './GameContainer.module.css';

type GameContainerProps = {
	game: GamesType;
	playersInGame: Player[];
};
const GameContainer = ({ game, playersInGame }: GameContainerProps) => (
	<main className={classes.container}>
		{game === 'uno' && <Uno playersInGame={playersInGame} />}
	</main>
);

export default GameContainer;
