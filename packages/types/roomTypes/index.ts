import type { ReactNode } from 'react';

export type Player = {
	username: string;
	socketId: string;
	role: 'admin' | 'player';
};

type GenericMessage = {
	messageId: string;
	date: Date;
	text: ReactNode;
};
export type Message = UserMessage | JoinedLeftMessage;
export type UserMessage = GenericMessage & {
	type: 'user';
	socketId: string;
	username: string;
};
export type JoinedLeftMessage = GenericMessage & {
	type: 'joined-left';
	action: 'joined' | 'left';
};

export type RoomState = {
	roomName: string | null;
	isPrivate: boolean;
	isStarted: boolean;
	players: Player[];
};