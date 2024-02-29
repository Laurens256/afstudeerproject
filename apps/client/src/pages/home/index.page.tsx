import { JoinRoomForm } from '@/components';
import socket from '@/socket';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { RoutePath, generateRoute } from '@/routes';
import { SocketRoomEvents } from '@shared/types';
import classes from './Home.module.css';

const Home = () => {
	const router = useRouter();

	const createRoom = () => {
		socket.emit(SocketRoomEvents.CREATE);
	};

	useEffect(() => {
		const onRoomCreate = (roomCode: string) => {
			router.push(generateRoute(RoutePath.Room, { roomCode }));
		};

		socket.on(SocketRoomEvents.CREATE, onRoomCreate);

		return () => {
			socket.off(SocketRoomEvents.CREATE, onRoomCreate);
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
