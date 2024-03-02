export const SocketRoomEvents = {
	CREATE: 'ROOM:create',
	ROOM_EXISTS: 'ROOM:exists',
	JOIN: 'ROOM:join',
	LEAVE: 'ROOM:leave',
	PLAYER_JOINED: 'ROOM:playerJoined',
	PLAYER_LEFT: 'ROOM:playerLeft',
	GET_ALL_PLAYERS: 'ROOM:getAllPlayers',
	ADMIN_CHANGE: 'ROOM:adminChange',
} as const;
