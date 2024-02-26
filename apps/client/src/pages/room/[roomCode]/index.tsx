import Link from 'next/link';
import { useEffect } from 'react';
import socket from '@/socket';
import { Button } from '@/components';
import { useRouter } from 'next/router';

const Room = () => {
	const router = useRouter();
	const { roomCode } = router.query;

	const handleRoomJoin = (code: string | null) => {
		if (!code) {
			console.error('Room not found');
		} else {
			// console.log('Room joined:', code);
		}
	};

	const emitTest = () => {
		socket.emit('test', roomCode);
	};
	const handleTest = () => {
		alert('test event received :0');
	};

	useEffect(() => {
		if (!roomCode) {
			return;
		}

		const handleRoomLeave = () => {
			console.log('leaving room:', roomCode);
			socket.emit('ROOM:leave', roomCode);
		};

		router.events.on('routeChangeStart', handleRoomLeave);
		router.events.on('beforeHistoryChange', handleRoomLeave);
		socket.on('ROOM:join', handleRoomJoin);
		socket.emit('ROOM:join', roomCode);

		socket.on('test', handleTest);

		return () => {
			socket.off('ROOM:join', handleRoomJoin);
			router.events.off('routeChangeStart', handleRoomLeave);
			router.events.off('beforeHistoryChange', handleRoomLeave);

			socket.off('test', handleTest);
		};
	}, [roomCode, router.events]);

	return (
		<div>
			This is room:
			{' '}
			{roomCode}
			<Link href="/">Back</Link>
			<Button onClick={emitTest}>Test button emitter :0</Button>
		</div>
	);
};

export default Room;
