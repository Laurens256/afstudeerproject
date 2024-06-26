import type { RoomState, Message, Player, PublicRoom } from '../roomTypes';

export type ServerToClientRoomEvents = {
	ROOM_EXISTS: (roomCode: string | null) => void;
	ROOM_CREATE: (roomCode: string) => void;
	ROOM_SET_STATE: (roomState: Partial<RoomState>) => void;
	ROOM_JOIN: (username: string, error: string | null) => void;
	ROOM_CHAT_MESSAGE: (message: Message) => void;
	ROOM_PLAYER_JOINED: (player: Player) => void;
	ROOM_PLAYER_LEFT: (socketId: string) => void;
	ROOM_ADMIN_CHANGE: (newAdminId: string) => void;
	ROOM_KICKED: () => void;
	ROOM_GET_PUBLIC_ROOMS: (rooms: PublicRoom[]) => void;
};

type CreateRoomProps = {
	maxPlayers: number;
	isPrivate: boolean;
};
export type ClientToServerRoomEvents = {
	ROOM_EXISTS: (roomCode: string) => void;
	ROOM_CREATE: ({ maxPlayers, isPrivate}: CreateRoomProps) => void;
	ROOM_JOIN: (roomCode: string, username: string) => void;
	ROOM_GET_STATE: () => void;
	ROOM_SET_STATE: (roomState: Partial<RoomState>) => void;
	ROOM_CHAT_MESSAGE: (message: string) => void;
	ROOM_LEAVE: () => void;
	ROOM_START_GAME: () => void;
	ROOM_END_GAME: () => void;
	ROOM_KICK_PLAYER: (socketId: string) => void;
	ROOM_GET_PUBLIC_ROOMS: () => void;
};