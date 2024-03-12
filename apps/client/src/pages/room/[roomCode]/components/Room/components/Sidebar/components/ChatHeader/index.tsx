import { Button } from '@/components';
import { IconBell, IconBellOff, IconUsers } from '@tabler/icons-react';
import { useLocalStorage } from '@/hooks';
import classes from './ChatHeader.module.css';

type ChatHeaderProps = {
};
const ChatHeader = ({ }: ChatHeaderProps) => {
	const [audioEnabled, setAudioEnabled] = useLocalStorage('audioEnabled', false);
	return (
		<header className={classes.header}>
			<h2 id="game-chat-heading">Game chat</h2>

			<div className={classes.buttonGroup}>
				<Button
					variant="icon"
					className={classes.button}
					onClick={() => setAudioEnabled(!audioEnabled)}
					aria-label={`${audioEnabled ? 'disable' : 'enable'} notification sound`}
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
