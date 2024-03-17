import type { Player } from '@shared/types';
import * as Dialog from '@radix-ui/react-dialog';
import classes from './WinnerModal.module.css';

type WinnerModalProps = {
	winner?: Player;
};
const WinnerModal = ({ winner }: WinnerModalProps) => {
	console;
	return (
		<Dialog.Root open>
			<Dialog.Portal>
				<Dialog.Overlay className={classes.backdrop} />
				<Dialog.Content className={classes.container}>
					<p>Huzzah</p>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
};

export default WinnerModal;
