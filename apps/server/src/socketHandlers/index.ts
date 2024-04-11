import type { ExtendedServer, ExtendedSocket } from '@/types';
import roomHandlers from './rooms';
import gameHandlers from './games';

export default function socketHandlers(io: ExtendedServer, socket: ExtendedSocket) {
	roomHandlers(io, socket);
	gameHandlers(io, socket);
}
