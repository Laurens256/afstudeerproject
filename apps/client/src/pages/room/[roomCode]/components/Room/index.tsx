import { useState, useEffect, useRef } from 'react';
import socket from '@/socket';
import { SocketRoomEvents } from '@shared/types';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Button } from '@/components';
import type { Player } from '@shared/types';
import clsx from 'clsx';
import { ChatSection } from './components';
import classes from './Room.module.css';
import { IconMessage } from '@tabler/icons-react';

type RoomProps = {
	roomCode: string;
	username: string;
};

const Room = ({ roomCode, username }: RoomProps) => {
	const router = useRouter();
	const [players, setPlayers] = useState<Player[]>([]);
	const ourPlayer = players.find((player) => player.socketId === socket.id);
	const containerRef = useRef<HTMLDivElement>(null);
	const chatWrapperRef = useRef<HTMLDivElement>(null);
	const chatToggleButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (!roomCode || !username) {
			return;
		}

		const handleSetAllPlayers = (allPlayers: Player[]) => {
			setPlayers(allPlayers);
		};
		const handlePlayerJoined = (player: Player) => {
			setPlayers((prevPlayers) => [...prevPlayers, player]);
		};
		const handlePlayerLeft = (socketId: string) => {
			setPlayers((prevPlayers) => prevPlayers.filter(
				(player) => player.socketId !== socketId,
			));
		};
		const handleAdminChange = (newAdminId: string) => {
			setPlayers((prevPlayers) => prevPlayers.map((player) => ({
				...player,
				role: player.socketId === newAdminId ? 'admin' : 'player',
			})));
		};

		// TODO: change GET_ALL_PLAYERS into more generic for initial state
		socket.on(SocketRoomEvents.GET_ALL_PLAYERS, handleSetAllPlayers);
		socket.on(SocketRoomEvents.PLAYER_JOINED, handlePlayerJoined);
		socket.on(SocketRoomEvents.PLAYER_LEFT, handlePlayerLeft);
		socket.on(SocketRoomEvents.ADMIN_CHANGE, handleAdminChange);

		socket.emit(SocketRoomEvents.GET_ALL_PLAYERS, roomCode);

		return () => {
			socket.off(SocketRoomEvents.GET_ALL_PLAYERS, handleSetAllPlayers);
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
					<span>game stuff here</span>
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
						<ChatSection roomCode={roomCode} players={players} ourPlayer={ourPlayer} />
					</div>
				</div>
			</div>
		</>
	);
};

export default Room;
