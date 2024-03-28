import { JoinRoomForm } from '@/components';
import socket from '@/socket';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { RoutePath, generateRoute } from '@/routes';
import classes from './Home.module.css';

const Home = () => {
	const router = useRouter();

	const createRoom = () => {
		socket.emit('ROOM_CREATE');
	};

	useEffect(() => {
		const onRoomCreate = (roomCode: string) => {
			router.push(generateRoute(RoutePath.Room, { roomCode }));
		};

		socket.on('ROOM_CREATE', onRoomCreate);

		return () => {
			socket.off('ROOM_CREATE', onRoomCreate);
		};
	}, [router]);

	return (
		<main className={classes.container}>
			<JoinRoomForm />
			<button onClick={createRoom} type="button">Create room</button>
		</main>
	);
};

export default Home;
