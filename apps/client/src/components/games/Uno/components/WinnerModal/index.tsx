import type { Player } from '@shared/types';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components';
import socket from '@/socket';
import classes from './WinnerModal.module.css';

type WinnerModalProps = {
	winner: Player;
	ourPlayer: Player | null;
};
const WinnerModal = ({ winner, ourPlayer }: WinnerModalProps) => {
	// const onPlayAgain = () => {
	// 	socket.emit('ROOM_START_GAME');
	// };
	const onBackToLobby = () => {
		socket.emit('ROOM_END_GAME');
	};

	return (
		<Dialog.Root open>
			<Dialog.Portal>
				<Dialog.Overlay className={classes.backdrop} />
				<Dialog.Content className={classes.container}>
					<Dialog.Title className={classes.title}>{`${winner.username} has won the game!`}</Dialog.Title>
					{ourPlayer?.role === 'admin' ? (
						<div className={classes.actionButtonsContainer}>
							{/* <Button onClick={onPlayAgain}>Play again</Button> */}
							<Button onClick={onBackToLobby}>Back to lobby</Button>
						</div>
					) : (
						<p>Waiting for admin to end game</p>
					)}
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default WinnerModal;
