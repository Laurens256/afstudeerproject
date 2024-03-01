import { io } from 'socket.io-client';
import { API_URL } from './app.constants';

const socket = io(API_URL, {
	autoConnect: false,
	extraHeaders: {
		'ngrok-skip-browser-warning': 'true',
	},
});

export default socket;
