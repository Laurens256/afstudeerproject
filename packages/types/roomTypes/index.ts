export type Player = {
	username: string;
	socketId: string;
	role: 'admin' | 'player';
};

export type Message = {
	messageId: string;
	type: 'user';
	socketId: string;
	username: string;
	text: string;
	date: Date;
} | {
	messageId: string;
	type: 'joined-left';
	text: string;
};