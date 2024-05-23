import * as Toast from '@radix-ui/react-toast';
import { useState } from 'react';
import type { GameErrorToastProps } from '@/types';
import { IconX } from '@tabler/icons-react';
import classes from './GameErrorToast.module.css';
import Button from '../Button';

type GameErrorToastProviderProps = {
	children: (createToast: (toast: GameErrorToastProps) => void) => React.ReactNode;
};

const GameErrorToastProvider = ({ children }: GameErrorToastProviderProps) => {
	const [toast, setToast] = useState<GameErrorToastProps | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	const createToast = (toastParam: GameErrorToastProps) => {
		setToast(toastParam);
		setIsOpen(toastParam !== null);
	};

	return (
		<Toast.Provider swipeDirection="up">
			{children(createToast)}
			<Toast.Root
				className={classes.root}
				open={isOpen}
				onOpenChange={setIsOpen}
				duration={5000}
				key={new Date().toString()} // set key so component reloads even if previous toast === new toast
			>
				<div className={classes.textContainer}>
					{toast?.title && (
						<Toast.Title className={classes.title} asChild>
							<h3>{toast.title}</h3>
						</Toast.Title>
					)}
					{toast?.message && (
						<Toast.Description asChild>
							<p>{toast.message}</p>
						</Toast.Description>
					)}
				</div>
				<Button
					variant="icon"
					aria-label="dismiss error"
					className={classes.closeButton}
					onClick={() => setIsOpen(false)}
				>
					<IconX size={20} />
				</Button>
			</Toast.Root>
			<Toast.Viewport className={classes.viewport} />
		</Toast.Provider>
	);
};

export default GameErrorToastProvider;
