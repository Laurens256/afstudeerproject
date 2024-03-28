import type { ExtendedServer, ExtendedSocket } from '@/types';
import unoHandlers from './uno';

const gameHandlers = (io: ExtendedServer, socket: ExtendedSocket) => {
	unoHandlers(io, socket);
};

export default gameHandlers;
