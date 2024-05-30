import { useState, useEffect, useRef } from 'react';
import socket from '@/socket';
import { useRouter } from 'next/router';
import Head from 'next/head';
import type { Player, RoomState } from '@shared/types';
import { Button, FullScreenLoader } from '@/components';
import clsx from 'clsx';
import { IconMessage } from '@tabler/icons-react';
import { createPortal } from 'react-dom';
import { Sidebar, RoomLobby, GameContainer } from './components';
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
		maxPlayers: 8,
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

		const handleRoomKicked = () => {
			router.push('/');
		};
		const handleRoomLeave = () => {
			socket.emit('ROOM_LEAVE');
		};

		router.events.on('routeChangeStart', handleRoomLeave);
		router.events.on('beforeHistoryChange', handleRoomLeave);

		// logic to kick users is not active so this is not needed
		// leaving it here for future reference
		socket.on('ROOM_KICKED', handleRoomKicked);

		return () => {
			router.events.off('routeChangeStart', handleRoomLeave);
			router.events.off('beforeHistoryChange', handleRoomLeave);
			socket.off('ROOM_KICKED', handleRoomKicked);
		};
	}, [roomCode, router]);

	const handleSidebarToggle = () => {
		// using refs to avoid rerendering entire game when chat toggles
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

	if (!ourPlayer) {
		return <FullScreenLoader />;
	}

	return (
		<>
			<Head>
				<title>Room lobby</title>
			</Head>
			<div className={clsx(classes.container, classes.sidebarOpen)} ref={containerRef}>
				<div className={classes.gameWrapper}>
					{roomState.isStarted && roomState.selectedGame
						? (
							<GameContainer
								game={roomState.selectedGame}
								playersInGame={playersInGame}
								isSpectator={!ourPlayer.inGame}
							/>
						) : (
							<RoomLobby
								roomCode={roomCode}
								roomState={roomState}
								ourPlayer={ourPlayer}
							/>
						)}
				</div>
				<Button
					className={classes.openSidebarButton}
					onClick={handleSidebarToggle}
					variant="cartoon"
					withCartoonRay={false}
					aria-label="open chat"
					ref={openSidebarButtonRef}
					inert=""
					aria-controls="chat-wrapper"
				>
					<IconMessage size={40} />
				</Button>
				<div ref={sidebarWrapperRef} id="chat-wrapper" className={classes.sidebarWrapper}>
					<Sidebar
						players={roomState.players}
						ourPlayer={ourPlayer}
						closeSidebar={handleSidebarToggle}
						activeGame={roomState.isStarted ? roomState.selectedGame : null}
					/>
				</div>
			</div>

			{/* announces when game has started / ended */}
			{createPortal(
				<p aria-live="assertive" className="visuallyHidden">
					{roomState.selectedGame && roomState.isStarted ? `a game of ${roomState.selectedGame} has started` : 'returned to lobby'}
				</p>,
				document.body,
			)}
		</>
	);
};

export default Room;
