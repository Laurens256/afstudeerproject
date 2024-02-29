import { useState, useEffect } from 'react';
import socket from '@/socket';
import { SocketRoomEvents } from '@shared/types';
import { useRouter } from 'next/router';

type RoomProps = {
	roomCode: string;
	username: string;
};

// TODO: move to types
type Player = {
	username: string;
	socketId: string;
	role: 'admin' | 'player';
};

const Room = ({ roomCode, username }: RoomProps) => {
	const router = useRouter();
	const [players, setPlayers] = useState<Player[]>([]);

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

	return (
		<div>
			<h1>
				Room
				{roomCode}
			</h1>
			{players.map((player) => (
				<div key={player.socketId}>
					<p>{player.username}</p>
					<p>{player.role}</p>
				</div>
			))}
		</div>
	);
};

export default Room;
