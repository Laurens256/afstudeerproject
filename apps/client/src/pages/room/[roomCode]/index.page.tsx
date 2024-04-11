import { useState } from 'react';
import { useRouter } from 'next/router';
import { JoinRoomForm } from '@/components';
import { NameInput, Room } from './components';

const RoomContainer = () => {
	const router = useRouter();
	const { roomCode } = router.query;
	const [username, setUsername] = useState<string>('');

	// TODO 404 page
	if (typeof roomCode !== 'string' || roomCode.length !== 6) {
		return <JoinRoomForm />;
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
