import type { ReactNode } from 'react';
import type { GamesType } from '../gameTypes';

export type Player = {
	username: string;
	socketId: string;
	role: 'admin' | 'player';
	inGame: GamesType | null;
};

type GenericMessage = {
	messageId: string;
	date: Date;
};

export type Message = UserMessage | JoinedLeftMessage;

export type UserMessage = GenericMessage & {
	type: 'user';
	socketId: string;
	username: string;
	text: string;
};
export type JoinedLeftMessage = GenericMessage & {
	type: 'joined-left';
	action: 'joined' | 'left';
	text: ReactNode;
};

export type RoomState = {
	roomName: string | null;
	isPrivate: boolean;
	isStarted: boolean;
	players: Player[];
	selectedGame: GamesType | null;
	maxPlayers: number;
};

export type PublicRoom = {
	roomCode: string;
	roomName: string;
	description: string;
	playersCount: number;
	maxPlayers: number;
};

export const ROOM_CODE_LENGTH = 6;
