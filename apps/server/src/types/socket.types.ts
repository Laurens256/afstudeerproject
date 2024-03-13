import type { ClientToServerEvents, ServerToClientEvents, Player } from '@shared/types';
import type { Socket, Server } from 'socket.io';

export type SocketMetaData = {
	roomCode?: string;
	role?: Player['role'];
	username?: Player['username'];
};

export type ExtendedSocket = Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketMetaData>;
export type ExtendedServer = Server<ClientToServerEvents, ServerToClientEvents, {}, SocketMetaData>;
