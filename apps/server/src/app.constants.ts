import 'dotenv/config';

const {
	SERVER_PORT = 3001,
	CLIENT_URL,
} = process.env;

export { CLIENT_URL, SERVER_PORT };
