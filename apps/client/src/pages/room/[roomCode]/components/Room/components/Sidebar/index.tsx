import { useState, useEffect } from 'react';
import socket from '@/socket';
import type { Player, Message, GamesType } from '@shared/types';
import classes from './Sidebar.module.css';
import { MessagesList, ChatHeader, MessageInput } from './components';

const createJoinedLeftMessage = (username: string, type: 'joined' | 'left'): Message => ({
	messageId: Date.now().toString(),
	type: 'joined-left',
	// eslint-disable-next-line react/jsx-one-expression-per-line
	text: <>{<b>{username}</b>}{` has ${type} the room`}</>,
	date: new Date(),
	action: type,
});

type ChatSectionProps = {
	players: Player[];
	ourPlayer: Player;
	closeSidebar: () => void;
	activeGame: GamesType | null;
};

const ChatSection = ({ players, ourPlayer, closeSidebar, activeGame }: ChatSectionProps) => {
	const [messages, setMessages] = useState<Message[]>([
		createJoinedLeftMessage(ourPlayer.username, 'joined'),
	]);

	const handleReceiveMessage = (message: Message) => {
		setMessages((prevMessages) => [...prevMessages, message]);
	};

	useEffect(() => {
		const handlePlayerJoined = (player: Player) => {
			handleReceiveMessage(createJoinedLeftMessage(player.username, 'joined'));
		};
		const handlePlayerLeft = (socketId: string) => {
			const player = players.find((p) => p.socketId === socketId);
			if (player) {
				handleReceiveMessage(createJoinedLeftMessage(player.username, 'left'));
			}
		};

		socket.on('ROOM_PLAYER_JOINED', handlePlayerJoined);
		socket.on('ROOM_PLAYER_LEFT', handlePlayerLeft);

		return () => {
			socket.off('ROOM_PLAYER_JOINED', handlePlayerJoined);
			socket.off('ROOM_PLAYER_LEFT', handlePlayerLeft);
		};
	}, [players]);

	useEffect(() => {
		socket.on('ROOM_CHAT_MESSAGE', handleReceiveMessage);

		return () => {
			socket.off('ROOM_CHAT_MESSAGE', handleReceiveMessage);
		};
	}, []);

	return (
		<aside className={classes.container} aria-labelledby="game-chat-heading">
			<ChatHeader
				players={players}
				roomActiveGame={activeGame}
				closeSidebar={closeSidebar}
			/>
			<MessagesList messages={messages} ourPlayer={ourPlayer} />
			<MessageInput />
		</aside>
	);
};

export default ChatSection;
