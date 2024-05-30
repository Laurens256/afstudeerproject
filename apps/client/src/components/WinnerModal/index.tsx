import type { Player } from '@shared/types';
import * as Dialog from '@radix-ui/react-dialog';
import Button from '@/components/Button';
import Avatar from '@/components/Avatar';
import socket from '@/socket';
import { IconCrown } from '@tabler/icons-react';
import classes from './WinnerModal.module.css';

type WinnerModalProps = {
	winner: Player;
	ourPlayer: Player | null;
};
const WinnerModal = ({ winner, ourPlayer }: WinnerModalProps) => {
	// not very elegant but this cleans up server and client nicely
	const onPlayAgain = () => {
		socket.emit('ROOM_END_GAME');

		setTimeout(() => {
			socket.emit('ROOM_START_GAME');
		}, 0);
	};
	const onBackToLobby = () => {
		socket.emit('ROOM_END_GAME');
	};

	return (
		<Dialog.Root open>
			<Dialog.Portal>
				<Dialog.Overlay className={classes.backdrop} />
				<Dialog.Content className={classes.container}>
					<div className={classes.avatarContainer}>
						<IconCrown className={classes.crownIcon} />
						<Avatar name={winner.username} className={classes.avatar} withBorder />
					</div>
					<Dialog.Title className={classes.title}>{`${winner.username} has won the game!`}</Dialog.Title>
					{ourPlayer?.role === 'admin' ? (
						<div className={classes.actionButtonsContainer}>
							<Button onClick={onPlayAgain}>Play again</Button>
							<Button variant="outline" onClick={onBackToLobby}>Back to lobby</Button>
						</div>
					) : (
						<p>Waiting for admin to end the game</p>
					)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default WinnerModal;
