import classes from './Home.module.css';
import { JoinRoomForm } from '@/components';
import socket from '@/socket';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { RoutePath, generateRoute } from '@/routes';

const Home = () => {
	const router = useRouter();
	
	const createRoom = () => {
		socket.emit('ROOM:create');
	};

	useEffect(() => {
		const onRoomCreate = (roomCode: string) => {
			router.push(generateRoute(RoutePath.Room, { roomCode }));
		};

		socket.on('ROOM:create', onRoomCreate);

		return () => {
			socket.off('ROOM:create', onRoomCreate);
		};
	}, [router]);

	return (
		<main className={classes.container}>
			<JoinRoomForm />
			<button onClick={createRoom}>Create room</button>
		</main>
	);
};

export default Home;
