import { useState, useEffect, useRef } from 'react';
import socket from '@/socket';
import { SocketRoomEvents } from '@shared/types';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button } from '@/components';
import type { Player, RoomState } from '@shared/types';
import clsx from 'clsx';
import { IconMessage } from '@tabler/icons-react';
import { ChatSection, RoomSettings } from './components';
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
	});

	const containerRef = useRef<HTMLDivElement>(null);
	const chatWrapperRef = useRef<HTMLDivElement>(null);
	const chatToggleButtonRef = useRef<HTMLButtonElement>(null);

	const ourPlayer = roomState.players.find((player) => player.username === username);

	useEffect(() => {
		if (!roomCode || !username) {
			return;
		}

		const handleSetRoomState = (state: RoomState) => {
			setRoomState((prev) => ({
				...prev,
				...state,
			}));
		};
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

		socket.on(SocketRoomEvents.GET_ROOM_STATE, handleSetRoomState);
		socket.on(SocketRoomEvents.PLAYER_JOINED, handlePlayerJoined);
		socket.on(SocketRoomEvents.PLAYER_LEFT, handlePlayerLeft);
		socket.on(SocketRoomEvents.ADMIN_CHANGE, handleAdminChange);

		socket.emit(SocketRoomEvents.GET_ROOM_STATE, roomCode);

		return () => {
			socket.off(SocketRoomEvents.GET_ROOM_STATE, handleSetRoomState);
			socket.off(SocketRoomEvents.PLAYER_JOINED, handlePlayerJoined);
			socket.off(SocketRoomEvents.PLAYER_LEFT, handlePlayerLeft);
			socket.off(SocketRoomEvents.ADMIN_CHANGE, handleAdminChange);
		};
	}, [roomCode, username]);

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

	const handleChatToggle = () => {
		const container = containerRef.current;
		const chatWrapper = chatWrapperRef.current;
		const chatToggleButton = chatToggleButtonRef.current;

		if (!container || !chatWrapper || !chatToggleButton) {
			return;
		}
		const isOpen = container.classList.contains(classes.chatOpen);

		container.classList.toggle(classes.chatOpen, !isOpen);
		chatWrapper.inert = isOpen;
		chatToggleButton.ariaExpanded = String(!isOpen);
		chatToggleButton.ariaLabel = isOpen ? 'Open chat' : 'Close chat';
	};

	useEffect(() => {
		const closeChatOnEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && containerRef.current?.classList.contains(classes.chatOpen)) {
				handleChatToggle();
			}
		};

		document.addEventListener('keydown', closeChatOnEscape);

		return () => {
			document.removeEventListener('keydown', closeChatOnEscape);
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
			<div className={clsx(classes.container, classes.chatOpen)} ref={containerRef}>
				<div className={classes.gameWrapper}>
					<RoomSettings
						roomCode={roomCode}
						roomState={roomState}
					/>
				</div>

				<div className={classes.chatWrapper}>
					<Button
						className={classes.chatToggleButton}
						onClick={handleChatToggle}
						variant="icon"
						innerRef={chatToggleButtonRef}
						aria-controls="chat-wrapper"
						aria-label="close chat"
					>
						<IconMessage size={24} />
					</Button>
					<div ref={chatWrapperRef} id="chat-wrapper">
						<ChatSection
							roomCode={roomCode}
							players={roomState.players}
							ourPlayer={ourPlayer}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default Room;
