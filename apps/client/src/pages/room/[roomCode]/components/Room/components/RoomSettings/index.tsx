import { type RoomState } from '@shared/types';
import socket from '@/socket';
import { Input } from '@/components';

type RoomSettingsProps = {
	roomCode: string;
	roomState: RoomState;
};

const RoomSettings = ({ roomCode, roomState }: RoomSettingsProps) => {
	const onRoomNameChange = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const roomName = (e.currentTarget.roomName.value).trim();
		if (roomName && roomName !== roomState.roomName) {
			socket.emit('ROOM_SET_STATE', roomCode, { roomName });
		}
	};

	return (
		<main>
			<h1>{`Code: ${roomCode}`}</h1>

			<h2>Players:</h2>
			<ul>
				{roomState.players.map((player) => (
					<li key={player.socketId}>
						{player.username}
					</li>
				))}
			</ul>

			<form onSubmit={onRoomNameChange}>
				{/* <h2>{`Room name: ${roomState.roomName}`}</h2> */}
				<Input
					name="roomName"
					id="roomName"
					defaultValue={roomState.roomName ?? ''}
					placeholder="Room name"
					label="Room name"
				/>
			</form>
		</main>
	);
};

export default RoomSettings;
