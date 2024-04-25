import { Button } from '@/components';
import { IconBell, IconBellOff, IconX, IconUsers } from '@tabler/icons-react';
import { useLocalStorage } from '@/hooks';
import * as Popover from '@radix-ui/react-popover';
import type { GamesType, Player } from '@shared/types';
import classes from './ChatHeader.module.css';
import PlayersList from '../PlayersList';

type ChatHeaderProps = {
	closeSidebar: () => void;
	players: Player[];
	roomActiveGame: GamesType | null;
};
const ChatHeader = ({ players, roomActiveGame, closeSidebar }: ChatHeaderProps) => {
	const [audioEnabled, setAudioEnabled] = useLocalStorage('audioEnabled', true);

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
					aria-label="toggle notification sound"
					role="switch"
					aria-checked={audioEnabled}
				>
					{audioEnabled ? <IconBell /> : <IconBellOff />}
				</Button>

				<Popover.Root>
					<Popover.Trigger asChild>
						<Button
							variant="icon"
							className={classes.button}
							aria-label="show room members"
						>
							<IconUsers />
						</Button>
					</Popover.Trigger>
					<Popover.Content align="end" sideOffset={4} className={classes.popoverContent}>
						<Popover.Arrow className={classes.popoverArrow} />
						<PlayersList
							players={players}
							roomActiveGame={roomActiveGame}
						/>
					</Popover.Content>
				</Popover.Root>
			</div>
		</header>
	);
};

export default ChatHeader;
