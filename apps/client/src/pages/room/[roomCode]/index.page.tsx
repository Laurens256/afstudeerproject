import { useState } from 'react';
import { useRouter } from 'next/router';
import { NameInput, Room } from './components';

const RoomContainer = () => {
	const router = useRouter();
	const { roomCode } = router.query;
	const [username, setUsername] = useState<string>('');

	// TODO ?
	if (typeof roomCode !== 'string' || roomCode.length !== 6) {
		return null;
	}

	return (
		<>
			{username ? (
				<Room roomCode={roomCode} username={username} />
			) : (
				<NameInput setUsername={setUsername} roomCode={roomCode} />
			)}
		</>
	);
};

export default RoomContainer;
