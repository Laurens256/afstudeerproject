import { useState, useEffect, useRef } from 'react';
import socket from '@/socket';
import { useRouter } from 'next/router';
import Head from 'next/head';
import type { Player, RoomState } from '@shared/types';
import { Button } from '@/components';
import clsx from 'clsx';
import { IconChevronLeft } from '@tabler/icons-react';
import { Sidebar, RoomSettings, GameContainer } from './components';
import classes from './Room.module.css';

type RoomProps = {
	roomCode: string;
	username: string;
};

const Room = ({ roomCode, username }: RoomProps) => {
	const router = useRouter();
	const [roomState, setRoomState] = useState<RoomState>({
		roomName: null,
		isPrivate: false,
		isStarted: false,
		players: [],
		selectedGame: null,
	});
	const playersInGame = roomState.players.filter((player) => player.inGame);

	const containerRef = useRef<HTMLDivElement>(null);
	const sidebarWrapperRef = useRef<HTMLDivElement>(null);
	const openSidebarButtonRef = useRef<HTMLButtonElement>(null);

	const ourPlayer = roomState.players.find((player) => player.username === username);

	useEffect(() => {
		if (!roomCode || !username) {
			return;
		}

		const handlePlayerJoined = (player: Player) => {
			setRoomState((prevRoomState) => ({
				...prevRoomState,
				players: [...prevRoomState.players, player],
			}));
		};
		const handlePlayerLeft = (socketId: string) => {
			setRoomState((prevRoomState) => ({
				...prevRoomState,
				players: prevRoomState.players.filter(
					(player) => player.socketId !== socketId,
				),
			}));
		};
		const handleAdminChange = (newAdminId: string) => {
			setRoomState((prevRoomState) => ({
				...prevRoomState,
				players: prevRoomState.players.map((player) => ({
					...player,
					role: player.socketId === newAdminId ? 'admin' : 'player',
				})),
			}));
		};

		const handleSetRoomState = (state: Partial<RoomState>) => {
			setRoomState((prev) => ({
				...prev,
				...state,
			}));
		};

		socket.on('ROOM_SET_STATE', handleSetRoomState);
		socket.on('ROOM_PLAYER_JOINED', handlePlayerJoined);
		socket.on('ROOM_PLAYER_LEFT', handlePlayerLeft);
		socket.on('ROOM_ADMIN_CHANGE', handleAdminChange);

		socket.emit('ROOM_GET_STATE');

		return () => {
			socket.off('ROOM_SET_STATE', handleSetRoomState);
			socket.off('ROOM_PLAYER_JOINED', handlePlayerJoined);
			socket.off('ROOM_PLAYER_LEFT', handlePlayerLeft);
			socket.off('ROOM_ADMIN_CHANGE', handleAdminChange);
		};
	}, [roomCode, username]);

	useEffect(() => {
		if (!roomCode) {
			return;
		}
		const handleRoomLeave = () => {
			socket.emit('ROOM_LEAVE');
		};

		router.events.on('routeChangeStart', handleRoomLeave);
		router.events.on('beforeHistoryChange', handleRoomLeave);

		return () => {
			router.events.off('routeChangeStart', handleRoomLeave);
			router.events.off('beforeHistoryChange', handleRoomLeave);
		};
	}, [roomCode, router.events]);

	const handleSidebarToggle = () => {
		const container = containerRef.current;
		const wrapper = sidebarWrapperRef.current;
		const button = openSidebarButtonRef.current;

		if (!container || !wrapper || !button) {
			return;
		}
		const isOpen = container.classList.contains(classes.sidebarOpen);

		container.classList.toggle(classes.sidebarOpen, !isOpen);
		wrapper.inert = isOpen;
		button.inert = !isOpen;
	};

	useEffect(() => {
		const closeSidebarOnEscape = (e: KeyboardEvent) => {
			if (
				e.key === 'Escape'
			&& containerRef.current?.classList.contains(classes.sidebarOpen)
			) {
				handleSidebarToggle();
			}
		};

		document.addEventListener('keydown', closeSidebarOnEscape);

		return () => {
			document.removeEventListener('keydown', closeSidebarOnEscape);
		};
	}, []);

	if (!ourPlayer) { // should not happen
		// TODO: 404 / loader (?)
		return null;
	}

	return (
		<>
			<Head>
				<title>{`Room ${roomCode}`}</title>
			</Head>
			<div className={clsx(classes.container, classes.sidebarOpen)} ref={containerRef}>
				<div className={classes.gameWrapper}>
					{roomState.isStarted && roomState.selectedGame
					&& playersInGame.find((player) => player.socketId === ourPlayer.socketId)
						? (
							<GameContainer
								game={roomState.selectedGame}
								playersInGame={playersInGame}
							/>
						) : (
							<RoomSettings
								roomCode={roomCode}
								roomState={roomState}
								ourPlayer={ourPlayer}
							/>
						)}
				</div>

				<Button
					className={classes.openSidebarButton}
					onClick={handleSidebarToggle}
					variant="icon"
					aria-label="open chat"
					innerRef={openSidebarButtonRef}
					inert=""
					aria-controls="chat-wrapper"
				>
					<IconChevronLeft size={40} />
				</Button>
				<div ref={sidebarWrapperRef} id="chat-wrapper" className={classes.sidebarWrapper}>
					<Sidebar
						players={roomState.players}
						ourPlayer={ourPlayer}
						closeSidebar={handleSidebarToggle}
					/>
				</div>
			</div>
		</>
	);
};

export default Room;
