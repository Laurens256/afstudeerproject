import { type Player, type RoomState } from '@shared/types';
import socket from '@/socket';
import { Input } from '@/components';
import classes from './RoomSettings.module.css';

type RoomSettingsProps = {
	roomCode: string;
	roomState: RoomState;
	ourPlayer: Player;
};

const RoomSettings = ({ roomCode, roomState, ourPlayer }: RoomSettingsProps) => {
	const onRoomNameChange = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const roomName = (e.currentTarget.roomName.value).trim();
		if (roomName && roomName !== roomState.roomName) {
			socket.emit('ROOM_SET_STATE', { roomName });
		}
	};

	return (
		<div className={classes.container}>
			<main className={classes.inner}>

				<h1>{`Code: ${roomCode}`}</h1>

				<h2>Players:</h2>
				<ul>
					{roomState.players.map((player) => (
						<li key={player.socketId}>
							{player.username}
							{' '}
							{player.role === 'admin' ? '(admin)' : ''}
						</li>
					))}
				</ul>

				<form onSubmit={onRoomNameChange}>
					<Input
						name="roomName"
						id="roomName"
						defaultValue={roomState.roomName ?? ''}
						placeholder="Room name"
						label="Room name"
						disabled={ourPlayer.role !== 'admin'}
					/>
				</form>
			</main>
		</div>
	);
};

export default RoomSettings;
