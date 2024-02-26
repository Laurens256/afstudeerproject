import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { roomHandlers } from './socketHandlers';
import 'dotenv/config';

const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL;

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

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: CLIENT_URL,
	},
});

io.on('connection', (socket) => {
	roomHandlers(io, socket);
});

process.on('warning', e => console.warn(e.stack));

httpServer.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
