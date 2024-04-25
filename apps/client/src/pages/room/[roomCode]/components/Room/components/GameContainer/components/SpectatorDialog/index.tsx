import clsx from 'clsx';
import { Button } from '@/components';
import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';
import { RoutePath } from '@/routes';
import type { GamesType } from '@shared/types';
import classes from './SpectatorDialog.module.css';

type SpectatorDialogProps = {
	isSpectator: boolean;
	game: GamesType;
	playersAmount: number;
};
const SpectatorDialog = ({ isSpectator, game, playersAmount }: SpectatorDialogProps) => (
	<Dialog.Root defaultOpen={isSpectator}>
		<Dialog.Portal>
			<Dialog.Overlay className={classes.dialogOverlay} />
			<Dialog.Content className={classes.spectatorDialog}>
				<div>
					<Dialog.Title>You are not playing</Dialog.Title>
					<Dialog.Description>
						The game started before you joined.
						You can spectate the game and play the next game or leave the room.
					</Dialog.Description>
				</div>

				<p>{`There are ${playersAmount} players playing ${game} in this room.`}</p>

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
);

export default SpectatorDialog;
