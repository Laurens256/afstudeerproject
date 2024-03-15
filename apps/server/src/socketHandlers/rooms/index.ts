/* eslint no-param-reassign: 0 */

import type { Message, Player, RoomState } from '@shared/types';
import type { ExtendedServer, ExtendedSocket } from '@/types';
import util from './util';

const roomHandlers = (io: ExtendedServer, socket: ExtendedSocket) => {
	const getRoomSockets = (roomCode: string) => Array.from(
		io.sockets.adapter.rooms.get(roomCode) || [],
	);

	const getRoomPlayers = (roomCode: string) => {
		const socketsInRoom = getRoomSockets(roomCode);
		const dataObjects: (Player | null)[] = socketsInRoom.map((id) => {
			const { username, role, inGame } = io.sockets.sockets.get(id)?.data || {};

			if (username && role) {
				return {
					socketId: id,
					username,
					role,
					inGame: inGame || null,
				};
			}
			return null;
		});
		return dataObjects.filter(
			(p) => p !== null,
		) as Player[];
	};

	const setRoomAdmin = (roomCode: string, socketId: string | null): string | null => {
		const sockets = getRoomSockets(roomCode);
		let newAdminId: string | null = null;

		if (sockets.length === 0) {
			return newAdminId;
		}

		sockets.forEach((playerSocketId, i) => {
			if ((i === 0 && !socketId) || (socketId && playerSocketId === socketId)) {
				const socketObj = io.sockets.sockets.get(playerSocketId);
				if (socketObj) {
					socketObj.data.role = 'admin';
					newAdminId = playerSocketId;
				}
			} else {
				const socketObj = io.sockets.sockets.get(playerSocketId);
				if (socketObj) {
					socketObj.data.role = 'player';
				}
			}
		});

		return newAdminId;
	};

	socket.on('ROOM_CREATE', () => {
		const roomCode = util.createRoom();
		socket.emit('ROOM_CREATE', roomCode);
	});

	socket.on('ROOM_EXISTS', (roomCode) => {
		const roomExists = util.roomExists(roomCode);
		socket.emit('ROOM_EXISTS', roomExists ? roomCode : null);
	});

	socket.on('ROOM_JOIN', (roomCode, inputName) => {
		const { username, error } = util.joinRoom(roomCode, inputName);
		socket.emit('ROOM_JOIN', username, error);

		if (error === null) {
			const role = getRoomSockets(roomCode).length === 0
				? 'admin' : 'player';

			socket.data = { roomCode, role, username };
			socket.join(roomCode);

			io.to(roomCode).emit('ROOM_PLAYER_JOINED', {
				socketId: socket.id,
				username,
				role,
				inGame: null,
			});
		}
	});

	socket.on('ROOM_GET_STATE', () => {
		const { roomCode } = socket.data;
		if (!roomCode) return;
		const room = util.getRoom(roomCode);
		if (!room) return;

		const playerObjects = getRoomPlayers(roomCode);

		const roomState: RoomState = {
			...room,
			players: playerObjects,
		};

		socket.emit('ROOM_SET_STATE', roomState);
	});

	socket.on('ROOM_SET_STATE', (roomState) => {
		const { roomCode } = socket.data;
		if (!roomCode) return;
		const newState = util.setRoomState(roomCode, roomState);

		if (newState) {
			io.to(roomCode).emit('ROOM_SET_STATE', newState);
		}
	});

	socket.on('ROOM_CHAT_MESSAGE', (text) => {
		const { roomCode, username } = socket.data;
		if (!roomCode || !username) return;

		const message: Message = {
			messageId: crypto.randomUUID(),
			type: 'user',
			socketId: socket.id,
			text,
			date: new Date(),
			username,
		};

		io.to(roomCode).emit('ROOM_CHAT_MESSAGE', message);
	});

	// TODO: handle room leave for active game if needed
	const handleRoomLeave = (roomCode: string | undefined, role: string | undefined) => {
		if (!roomCode) return;
		io.to(roomCode).except(socket.id).emit('ROOM_PLAYER_LEFT', socket.id);
		socket.leave(roomCode);
		socket.data = {};

		if (!getRoomSockets(roomCode).length) {
			util.deleteRoom(roomCode);
		}

		if (role === 'admin') {
			const newAdminId = setRoomAdmin(roomCode, null);
			if (newAdminId) {
				io.to(roomCode).emit('ROOM_ADMIN_CHANGE', newAdminId);
			}
		}
	};

	socket.on('ROOM_START_GAME', () => {
		const { roomCode } = socket.data;
		if (!roomCode) return;
		const sockets = getRoomSockets(roomCode).slice(0, 4);
		const game = util.getRoom(roomCode)?.selectedGame;

		sockets.forEach((id) => {
			const socketObj = io.sockets.sockets.get(id);
			if (socketObj && game) {
				socketObj.data.inGame = game;
			}
		});

		const playersObjects = getRoomPlayers(roomCode);

		util.setRoomState(roomCode, {
			isStarted: true,
			selectedGame: game,
		});

		io.to(roomCode).emit('ROOM_SET_STATE', {
			isStarted: true,
			selectedGame: game,
			players: playersObjects,
		});
	});

	socket.on('ROOM_LEAVE', () => {
		const { roomCode, role } = socket.data;
		handleRoomLeave(roomCode, role);
	});

	socket.on('disconnect', () => {
		const { roomCode, role } = socket.data;
		handleRoomLeave(roomCode, role);
	});
};

export default roomHandlers;
