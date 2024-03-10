export const SocketRoomEvents = {
	CREATE: 'ROOM:create',
	ROOM_EXISTS: 'ROOM:exists',
	JOIN: 'ROOM:join',
	LEAVE: 'ROOM:leave',
	PLAYER_JOINED: 'ROOM:playerJoined',
	PLAYER_LEFT: 'ROOM:playerLeft',
	GET_ROOM_STATE: 'ROOM:getRoomState',
	SET_ROOM_STATE: 'ROOM:setRoomState',
	ADMIN_CHANGE: 'ROOM:adminChange',
	CHAT_MESSAGE: 'ROOM:chatMessage',
} as const;
