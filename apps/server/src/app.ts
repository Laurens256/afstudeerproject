import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import os from 'os';
import { roomHandlers } from './socketHandlers';
import 'dotenv/config';
import { PORT, CLIENT_URL, CLIENT_PORT } from './app.constants';

if (!CLIENT_URL) {
	throw new Error('No client URL set');
}

const app = express();
app.use(cors({
	origin: CLIENT_URL,
	credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const localIps = Object.values(os.networkInterfaces()).reduce<string[]>(
	(result, list) => (list ? result.concat(list.filter((iface) => iface.family === 'IPv4'
			&& !iface.internal && iface.address).map((iface) => iface.address)) : result),
	[],
);

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: [
			CLIENT_URL,
			...(CLIENT_PORT ? localIps.map((ip) => `http://${ip}:${CLIENT_PORT}`) : []),
		],
	},
});

io.on('connection', (socket) => {
	roomHandlers(io, socket);
});

process.on('warning', (e) => console.warn(e.stack));

httpServer.listen(PORT, () => {
	console.log(`Server is listening on port: ${PORT}`);
});
