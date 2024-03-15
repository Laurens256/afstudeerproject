import type { ClientToServerEvents, ServerToClientEvents, Player, GamesType } from '@shared/types';
import type { Socket, Server } from 'socket.io';

export type SocketMetaData = {
	roomCode?: string;
	role?: Player['role'];
	username?: Player['username'];
	inGame?: GamesType;
};

export type ExtendedSocket = Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketMetaData>;
export type ExtendedServer = Server<ClientToServerEvents, ServerToClientEvents, {}, SocketMetaData>;
