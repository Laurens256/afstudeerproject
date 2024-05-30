import { useState } from 'react';
import { useRouter } from 'next/router';
import Custom404 from '@/pages/404.page';
import { NameInput, Room } from './components';

const RoomContainer = () => {
	const router = useRouter();
	const { roomCode } = router.query;
	const [username, setUsername] = useState<string>('');

	if (typeof roomCode !== 'string' || roomCode.length !== 6) {
		return <Custom404 />;
	}

	// when username is set, render room, otherwise render name input
	// username gets set on confirmation from server we joined the room
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
