/* eslint no-param-reassign: 0 */

import { Games, type GamesType, type Message, type Player, type RoomState } from '@shared/types';
import type { ExtendedServer, ExtendedSocket } from '@/types';
import util from './util';
import unoUtil from '../games/uno/util';

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

	socket.on('ROOM_CREATE', ({ maxPlayers, isPrivate }) => {
		const roomCode = util.createRoom({ maxPlayers, isPrivate });
		socket.emit('ROOM_CREATE', roomCode);
	});

	socket.on('ROOM_EXISTS', (roomCode) => {
		const roomExists = util.roomExists(roomCode);
		socket.emit('ROOM_EXISTS', roomExists ? roomCode : null);
	});

	socket.on('ROOM_JOIN', (inputCode, inputName) => {
		const { username, error, roomCode } = util.joinRoom(inputCode, inputName);
		socket.emit('ROOM_JOIN', username, error);

		if (error === null) {
			const role = getRoomSockets(roomCode).length === 0
				? 'admin' : 'player';

			socket.data = { roomCode, role, username };
			socket.join(roomCode);
			util.changePlayerCount(roomCode, 1);

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
			if (newState.isStarted === false) {
				const sockets = getRoomSockets(roomCode);
				sockets.forEach((id) => {
					const socketObj = io.sockets.sockets.get(id);
					if (socketObj) {
						socketObj.data.inGame = undefined;
					}
				});
			}
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

	socket.on('ROOM_START_GAME', () => {
		const { roomCode } = socket.data;
		if (!roomCode) return;
		const sockets = getRoomSockets(roomCode);
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

	const handleGameEnd = (roomCode: string, game: GamesType | undefined) => {
		switch (game) {
			case Games.UNO: {
				unoUtil.endGame(roomCode);
				break;
			}
		}
	};

	socket.on('ROOM_END_GAME', () => {
		const { roomCode, inGame } = socket.data;
		if (!roomCode) return;
		const sockets = getRoomSockets(roomCode);

		sockets.forEach((id) => {
			const socketObj = io.sockets.sockets.get(id);
			if (socketObj) {
				socketObj.data.inGame = undefined;
			}
		});

		const playersObjects = getRoomPlayers(roomCode);

		util.setRoomState(roomCode, {
			isStarted: false,
		});

		io.to(roomCode).emit('ROOM_SET_STATE', {
			isStarted: false,
			players: playersObjects,
		});
		handleGameEnd(roomCode, inGame);
	});

	const leaveGameAfterRoomLeave = (
		roomCode: string,
		socketId: string,
		game: GamesType | undefined,
	) => {
		switch (game) {
			case Games.UNO: {
				const newState = unoUtil.handlePlayerLeave(roomCode, socketId);
				if (newState) {
					io.to(roomCode).emit('UNO_GET_GAME_STATE', newState);
				}
				break;
			}
		}
	};
	const handleRoomLeave = (
		roomCode: string | undefined,
		role: string | undefined,
		inGame: GamesType | undefined,
	) => {
		if (!roomCode) return;
		io.to(roomCode).except(socket.id).emit('ROOM_PLAYER_LEFT', socket.id);
		socket.leave(roomCode);
		util.changePlayerCount(roomCode, -1);
		socket.data = {};

		if (!getRoomSockets(roomCode).length) {
			util.deleteRoom(roomCode);
			handleGameEnd(roomCode, inGame);
			return;
		}

		if (role === 'admin') {
			const newAdminId = setRoomAdmin(roomCode, null);
			if (newAdminId) {
				io.to(roomCode).emit('ROOM_ADMIN_CHANGE', newAdminId);
			}
		}
		leaveGameAfterRoomLeave(roomCode, socket.id, inGame);
	};

	socket.on('ROOM_KICK_PLAYER', (socketId) => {
		io.to(socketId).emit('ROOM_KICKED');
	});

	socket.on('ROOM_LEAVE', () => {
		const { roomCode, role, inGame } = socket.data;
		handleRoomLeave(roomCode, role, inGame);
	});
	socket.on('disconnect', () => {
		const { roomCode, role, inGame } = socket.data;
		handleRoomLeave(roomCode, role, inGame);
	});
};

export default roomHandlers;
