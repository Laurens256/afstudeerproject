import { memo } from 'react';
import type { GamesType, Player } from '@shared/types';
import { Button, Avatar } from '@/components';
import socket from '@/socket';
import { IconX } from '@tabler/icons-react';
import classes from './PlayersList.module.css';

type PLayersListProps = {
	players: Player[];
	roomActiveGame: GamesType | null;
};
const PlayersList = ({ players, roomActiveGame }: PLayersListProps) => {
	const adminId = players.find((player) => player.role === 'admin')?.socketId;

	return (
		<div className={classes.container}>
			<h3>Room members</h3>
			<ul className={classes.playersList}>
				{players.map((player) => (
					<li key={player.socketId} className={classes.playerListItem}>
						<Avatar name={player.username} sizeRem={2} withBorder />
						<div className={classes.playerTextContainer}>
							<div className={classes.playerNameContainer}>
								<p className={classes.playerName}>{player.username}</p>
								{player.role === 'admin' && <span className={classes.adminBadge}>(Admin)</span>}
							</div>
							{roomActiveGame && (
								<span className={classes.playerStatus}>
									{`${player.inGame ? 'Playing' : 'Spectating'} ${roomActiveGame}`}
								</span>
							)}
						</div>
						{adminId === socket.id && player.role !== 'admin' && (
							<Button
								className={classes.kickButton}
								variant="icon"
								onClick={() => socket.emit('ROOM_KICK_PLAYER', player.socketId)}
							>
								<IconX />
							</Button>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

export default memo(PlayersList);
