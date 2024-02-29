import Link from 'next/link';
import { useEffect, useState } from 'react';
import socket from '@/socket';
import { useRouter } from 'next/router';
import { SocketRoomEvents } from '@shared/types';
import { NameInput } from './components';

const Room = () => {
	const router = useRouter();
	const { roomCode } = router.query;
	const [username, setUsername] = useState<string>('');

	useEffect(() => {
		if (!roomCode) {
			return;
		}

		const handleRoomLeave = () => {
			socket.emit(SocketRoomEvents.LEAVE, roomCode);
		};

		router.events.on('routeChangeStart', handleRoomLeave);
		router.events.on('beforeHistoryChange', handleRoomLeave);

		return () => {
			router.events.off('routeChangeStart', handleRoomLeave);
			router.events.off('beforeHistoryChange', handleRoomLeave);
		};
	}, [roomCode, router.events]);

	// TODO
	if (typeof roomCode !== 'string' || roomCode.length !== 6) {
		return null;
	}

	return (
		<>
			{username ? (
				<div>
					This is room:
					{' '}
					{roomCode}
					<Link href="/">Back</Link>
				</div>
			) : (
				<NameInput setUsername={setUsername} roomCode={roomCode} />
			)}
		</>
	);
};

export default Room;
