import { Uno } from '@/components/games';
import type { Games } from '@shared/types/gameTypes';
import classes from './GameContainer.module.css';

type GameContainerProps = {
	game: Games
};
const GameContainer = ({ game }: GameContainerProps) => (
	<main className={classes.container}>
		{game === 'uno' && <Uno />}
	</main>
);

export default GameContainer;
