import { type Player, type RoomState } from '@shared/types';
import socket from '@/socket';
import { Button } from '@/components';
import classes from './RoomSettings.module.css';

type RoomSettingsProps = {
	roomCode: string;
	roomState: RoomState;
	ourPlayer: Player;
};

const RoomSettings = ({ roomCode, roomState, ourPlayer }: RoomSettingsProps) => {
	const changeRoomName = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const roomName = (e.currentTarget.roomName.value).trim();
		if (roomName && roomName !== roomState.roomName) {
			socket.emit('ROOM_SET_STATE', { roomName });
		}
	};

	const handleStartGame = () => {
		socket.emit('ROOM_START_GAME');
	};

	return (
		<div className={classes.container}>
			<header className={classes.header}>
				<h1
					className={classes.roomName}
				>
					{roomState.roomName}
				</h1>
				<h2 className={classes.roomCodeContainer}>
					{`Room Code: ${roomCode}`}
				</h2>
			</header>

			{ourPlayer.role === 'admin' && (
				<Button onClick={handleStartGame}>Start game</Button>
			)}

		</div>
	);
};

export default RoomSettings;
