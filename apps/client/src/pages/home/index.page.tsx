import { Button, JoinRoomForm } from '@/components';
import socket from '@/socket';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { RoutePath, generateRoute } from '@/routes';
import * as Tabs from '@radix-ui/react-tabs';
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

	// TODO: make users join a room when they're on the home page
	// useEffect(() => {
	// 	const handleRoomLeave = () => {
	// 		socket.emit('ROOM_LEAVE');
	// 	};

	// 	router.events.on('routeChangeStart', handleRoomLeave);
	// 	router.events.on('beforeHistoryChange', handleRoomLeave);

	// 	return () => {
	// 		router.events.off('routeChangeStart', handleRoomLeave);
	// 		router.events.off('beforeHistoryChange', handleRoomLeave);
	// 	};
	// }, [router.events]);

	return (
		<main className={classes.main}>
			<Tabs.Root
				defaultValue="join-tab"
				// pass invalid orientation so both horizontal and vertical keyboard controls work
				// @ts-expect-error
				orientation=""
				className={classes.tabsRoot}
			>
				<Tabs.List aria-label="join or create room" className={classes.tabsList}>
					<Tabs.Trigger value="join-tab" className={classes.tabButton}>JOIN ROOM</Tabs.Trigger>
					<Tabs.Trigger value="create-tab" className={classes.tabButton}>CREATE ROOM</Tabs.Trigger>
				</Tabs.List>

				<Tabs.Content value="join-tab" className={classes.tabContent}>
					<JoinRoomForm className={classes.joinRoomForm} />
				</Tabs.Content>

				<Tabs.Content value="create-tab" className={classes.tabContent}>
					<Button onClick={createRoom}>Create room</Button>
				</Tabs.Content>
			</Tabs.Root>
		</main>
	);
};

export default Home;
