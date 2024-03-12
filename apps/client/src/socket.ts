import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from '@shared/types';
import { API_URL } from './app.constants';

if (!API_URL) {
	throw new Error('API_URL not specified');
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(API_URL, {
	autoConnect: false,
});

export default socket;
