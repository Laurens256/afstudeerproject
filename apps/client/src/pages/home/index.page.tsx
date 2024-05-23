import { JoinRoomForm } from '@/components';
import socket from '@/socket';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { RoutePath, generateRoute } from '@/routes';
import * as Tabs from '@radix-ui/react-tabs';
import classes from './Home.module.css';
import { CreateRoomForm, PublicRooms } from './components';

const Home = () => {
	const router = useRouter();

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
					<CreateRoomForm />
				</Tabs.Content>
			</Tabs.Root>

			<PublicRooms />
		</main>
	);
};

export default Home;
