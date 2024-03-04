import { useState, useEffect, useRef } from 'react';
import socket from '@/socket';
import { Input, Button } from '@/components';
import type { Player, Message } from '@shared/types';
import { SocketRoomEvents } from '@shared/types';
import { IconSend } from '@tabler/icons-react';
import classes from './ChatSection.module.css';

const createJoinedLeftMessage = (username: string, type: 'joined' | 'left'): Message => ({
	messageId: Date.now().toString(),
	type: 'joined-left',
	text: `${username} has ${type} the room`,
});

type ChatSectionProps = {
	roomCode: string;
	players: Player[];
	ourPlayer: Player;
};

const ChatSection = ({ roomCode, players, ourPlayer }: ChatSectionProps) => {
	const messageInputRef = useRef<HTMLInputElement>(null);
	const [messages, setMessages] = useState<Message[]>([{
		messageId: ':3',
		type: 'joined-left',
		text: 'You joined the room',
	}]);

	useEffect(() => {
		const handlePlayerJoined = (player: Player) => {
			setMessages((prevMessages) => [...prevMessages,
				createJoinedLeftMessage(player.username, 'joined')]);
		};
		const handlePlayerLeft = (socketId: string) => {
			const player = players.find((p) => p.socketId === socketId);
			if (player) {
				setMessages((prevMessages) => [...prevMessages,
					createJoinedLeftMessage(player.username, 'left')]);
			}
		};
		socket.on(SocketRoomEvents.PLAYER_JOINED, handlePlayerJoined);
		socket.on(SocketRoomEvents.PLAYER_LEFT, handlePlayerLeft);

		return () => {
			socket.off(SocketRoomEvents.PLAYER_JOINED, handlePlayerJoined);
			socket.off(SocketRoomEvents.PLAYER_LEFT, handlePlayerLeft);
		};
	}, [players]);

	useEffect(() => {
		const handleReceiveMessage = (message: Message) => {
			setMessages((prevMessages) => [...prevMessages, message]);
		};
		socket.on(SocketRoomEvents.CHAT_MESSAGE, handleReceiveMessage);

		return () => {
			socket.off(SocketRoomEvents.CHAT_MESSAGE, handleReceiveMessage);
		};
	}, []);

	const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const message = messageInputRef.current?.value?.trim();

		if (!message) {
			return;
		}

		const messageObject: Message = {
			messageId: Date.now().toString(),
			type: 'user',
			socketId: ourPlayer.socketId,
			username: ourPlayer.username,
			text: message,
			date: new Date(),
		};
		setMessages((prevMessages) => [...prevMessages, messageObject]);

		socket.emit(SocketRoomEvents.CHAT_MESSAGE, roomCode, message);

		(messageInputRef.current as HTMLInputElement).value = '';
	};

	return (
		<aside className={classes.container}>
			<header className={classes.header}>
				<h2>Game chat</h2>
			</header>
			<ul className={classes.messagesList}>
				{messages.map((message) => (
					<li
						key={message.messageId}
						className={classes[message.type]}
					>
						{message.text}
					</li>
				))}
			</ul>

			<form onSubmit={handleSendMessage} className={classes.messageForm}>
				<Input
					className={classes.messageInput}
					ref={messageInputRef}
					label="send a message"
					id="send-message"
					name="send-message"
					labelVisuallyHidden
					autoComplete="off"
					autoCapitalize="on"
					placeholder="Send a message"
				>
					<Button
						type="submit"
						variant="icon"
						aria-label="send message"
						className={classes.sendMessageButton}
					>
						<IconSend />
					</Button>
				</Input>
			</form>
		</aside>
	);
};

export default ChatSection;
