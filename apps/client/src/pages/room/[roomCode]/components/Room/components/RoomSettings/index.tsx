import { type Player, type RoomState } from '@shared/types';
import socket from '@/socket';
import { Button, Avatar, Input } from '@/components';
import { IconCrown, IconCheck, IconPencil } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import classes from './RoomSettings.module.css';

type RoomSettingsProps = {
	roomCode: string;
	roomState: RoomState;
	ourPlayer: Player;
};

const RoomSettings = ({ roomCode, roomState, ourPlayer }: RoomSettingsProps) => {
	const [localRoomName, setLocalRoomName] = useState<string | null>(null);
	useEffect(() => {
		setLocalRoomName(roomState.roomName);
	}, [roomState.roomName]);

	const changeRoomName = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const roomName: string = (e.currentTarget.room_name.value).trim();
		if (roomName && roomName !== roomState.roomName && roomName.length <= 30) {
			setLocalRoomName(roomName);

			socket.emit('ROOM_SET_STATE', { roomName });
			const form = e.currentTarget;
			form.room_name.blur();
		}
	};

	const handleStartGame = () => {
		if (roomState.players.length > 1) {
			socket.emit('ROOM_START_GAME');
		}
	};

	const enoughPlayersToStart = roomState.players.length > 1;

	return (
		<div className={classes.container}>
			<header>
				<h1 className={classes.roomPin}>{`Room PIN: ${roomCode.toUpperCase()}`}</h1>
			</header>

			<main className={classes.main}>
				{ourPlayer.role === 'admin' ? (
					<form
						className={classes.editRoomNameForm}
						onSubmit={changeRoomName}
						onBlur={(e) => {
							if (!e.currentTarget.contains(e.relatedTarget)) {
								setLocalRoomName(roomState.roomName);
							}
						}}
					>
						<Input
							label="Change room name"
							labelVisuallyHidden
							id="room_name"
							name="room_name"
							maxLength={30}
							className={classes.roomNameInput}
							value={localRoomName || ''}
							onInput={(e) => setLocalRoomName(e.currentTarget.value)}
							onFocus={(e) => e.currentTarget.select()}
							enterKeyHint="done"
							autoComplete="off"
						/>
						<IconPencil className={classes.editIcon} />
						<Button
							variant="icon"
							className={classes.saveRoomNameButton}
							aria-label="save room name"
							type="submit"
						>
							<IconCheck />
						</Button>
					</form>
				) : (
					<h2 className={classes.roomName}>{roomState.roomName}</h2>
				)}

				<div className={classes.playersContainer}>
					<h3>Players</h3>
					<ul className={classes.playersList}>
						{roomState.players.map((player) => (
							<li key={player.socketId} className={classes.playerListItem}>
								<div className={classes.avatarContainer}>
									<Avatar sizeRem={2} name={player.username} withBorder />
									{player.role === 'admin' && <IconCrown className={classes.crown} />}
								</div>
								{player.username}
							</li>
						))}
					</ul>
				</div>

				{ourPlayer.role === 'admin' ? (
					<Button
						onClick={handleStartGame}
						className={classes.startGameButton}
						data-disabled={!enoughPlayersToStart}
					>
						{enoughPlayersToStart ? 'Start Game' : 'You need at least 2 players to start the game'}
					</Button>
				) : (
					<p className={classes.waitingText}>Waiting for admin to start the game</p>
				)}
			</main>
		</div>
	);
};

export default RoomSettings;
