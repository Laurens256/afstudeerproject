import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { roomHandlers } from './socketHandlers';
import 'dotenv/config';
import { SERVER_PORT, CLIENT_URL } from './app.constants';
import type { ExtendedServer } from './types';

const allowedOrigins = [CLIENT_URL].filter(Boolean) as string[];

if (!allowedOrigins.length) {
	throw new Error('Allowed origins not specified');
}

const app = express();
app.use(cors({
	origin: allowedOrigins,
	credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.json('api is running :3');
});

const httpServer = http.createServer(app);
const io: ExtendedServer = new Server(httpServer, {
	cors: {
		origin: allowedOrigins,
	},
});

io.on('connection', (socket) => {
	roomHandlers(io, socket);
});

process.on('warning', (e) => console.warn(e.stack));

httpServer.listen(SERVER_PORT, () => {
	console.log(`Server is listening on port: ${SERVER_PORT}`);
});
