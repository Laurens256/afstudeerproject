import { useState } from 'react';
import { useRouter } from 'next/router';
import { ROOM_CODE_LENGTH } from '@shared/types';
import { notFound } from '@/utils';
import { NameInput, Room } from './components';

const RoomContainer = () => {
	const router = useRouter();
	const { roomCode } = router.query;
	const [username, setUsername] = useState<string>('');

	const isValidRoomCode = typeof roomCode === 'string' && roomCode.length === ROOM_CODE_LENGTH;
	if (!isValidRoomCode) {
		return notFound();
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
