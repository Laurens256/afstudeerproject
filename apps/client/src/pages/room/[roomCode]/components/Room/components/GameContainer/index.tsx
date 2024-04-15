import { Uno } from '@/components/games';
import { Games, type GamesType, type Player } from '@shared/types';
import clsx from 'clsx';
import { GameErrorToastProvider, Button } from '@/components';
import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { RoutePath } from '@/routes';
import classes from './GameContainer.module.css';

type GameContainerProps = {
	game: GamesType;
	playersInGame: Player[];
	isSpectator: boolean;
};
const GameContainer = ({ game, playersInGame, isSpectator }: GameContainerProps) => (
	<main className={clsx(classes.container, classes[game.toLowerCase().replace(' ', '-')])}>
		{isSpectator && (
			<Dialog.Root defaultOpen>
				<Dialog.Portal>
					<Dialog.Overlay className={classes.dialogOverlay} />
					<Dialog.Content className={classes.spectatorDialog}>
						<Dialog.Title>You are not playing</Dialog.Title>
						<Dialog.Description>
							The game started before you joined.
							You can spectate the game and play the next round or leave the room.
						</Dialog.Description>

						<div className={classes.dialogActionButtons}>
							<Link
								href={RoutePath.Home}
								className={clsx(classes.dialogActionButton, classes.leave)}
							>
								Leave room
							</Link>
							<Dialog.Close asChild>
								<Button className={clsx(classes.dialogActionButton, classes.spectate)} variant="unstyled">
									Spectate game
								</Button>
							</Dialog.Close>
						</div>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog.Root>
		)}
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
