export const SocketRoomEvents = {
	CREATE: 'ROOM:create',
	CONNECT: 'ROOM:connect',
	JOIN: 'ROOM:join',
	LEAVE: 'ROOM:leave',
	PLAYER_JOINED: 'ROOM:playerJoined',
	PLAYER_LEFT: 'ROOM:playerLeft',
	GET_ALL_PLAYERS: 'ROOM:getAllPlayers',
	ADMIN_CHANGE: 'ROOM:adminChange',
} as const;
