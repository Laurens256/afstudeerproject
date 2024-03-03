import { io } from 'socket.io-client';
import { API_URL } from './app.constants';

if (!API_URL) {
	throw new Error('API_URL not specified');
}

const socket = io(API_URL, {
	autoConnect: false,
});

export default socket;
