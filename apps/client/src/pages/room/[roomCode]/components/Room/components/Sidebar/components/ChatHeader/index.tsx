import { Button } from '@/components';
import { IconBell, IconBellOff, IconUsers, IconX } from '@tabler/icons-react';
import { useLocalStorage } from '@/hooks';
import classes from './ChatHeader.module.css';

type ChatHeaderProps = {
	closeSidebar: () => void;
};
const ChatHeader = ({ closeSidebar }: ChatHeaderProps) => {
	const [audioEnabled, setAudioEnabled] = useLocalStorage('audioEnabled', false);
	return (
		<header className={classes.header}>
			<div className={classes.headingCloseButtonWrapper}>
				<Button onClick={closeSidebar} aria-label="close chat" variant="icon">
					<IconX />
				</Button>
				<h2 id="game-chat-heading">Game chat</h2>
			</div>

			<div className={classes.buttonGroup}>
				<Button
					variant="icon"
					className={classes.button}
					onClick={() => setAudioEnabled(!audioEnabled)}
					aria-label={`toggle notification sound`}
					// aria-label={`${audioEnabled ? 'disable' : 'enable'} notification sound`}
					role="switch"
					aria-checked={audioEnabled}
				>
					{audioEnabled ? <IconBell /> : <IconBellOff />}
				</Button>

				<Button variant="icon" className={classes.button} aria-label="show room users">
					<IconUsers />
				</Button>
			</div>
		</header>
	);
};

export default ChatHeader;
