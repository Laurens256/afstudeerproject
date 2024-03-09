import { type RoomState } from '@shared/types';

type RoomSettingsProps = {
	roomCode: string;
	roomState: RoomState;
};

const RoomSettings = ({ roomCode, roomState }: RoomSettingsProps) => {
	console;

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

			<h2>{`Room name: ${roomState.roomName}`}</h2>
		</main>
	);
};

export default RoomSettings;
