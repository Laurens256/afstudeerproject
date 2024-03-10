import { useState, useEffect, useRef, useContext } from 'react';
import socket from '@/socket';
import { Input, Button, AudioContext } from '@/components';
import type { Player, Message } from '@shared/types';
import { SocketRoomEvents } from '@shared/types';
import { IconSend } from '@tabler/icons-react';
import classes from './ChatSection.module.css';
import { Message as MessageComponent, ChatHeader } from './components';

const createJoinedLeftMessage = (username: string, type: 'joined' | 'left'): Message => ({
	messageId: Date.now().toString(),
	type: 'joined-left',
	// eslint-disable-next-line react/jsx-one-expression-per-line
	text: <>{<b>{username}</b>}{` has ${type} the room`}</>,
	date: new Date(),
	action: type,
});

type ChatSectionProps = {
	roomCode: string;
	players: Player[];
	ourPlayer: Player;
};

const ChatSection = ({ roomCode, players, ourPlayer }: ChatSectionProps) => {
	const messageInputRef = useRef<HTMLInputElement>(null);
	const messageListRef = useRef<HTMLUListElement>(null);
	const [messages, setMessages] = useState<Message[]>([
		createJoinedLeftMessage(ourPlayer.username, 'joined'),
	]);

	const audioContext = useContext(AudioContext);

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
		const handleAudioNotification = (message: Message) => {
			if (
				message.type === 'user'
			&& message.socketId !== ourPlayer.socketId
			) {
				audioContext.gameChat('messageReceived');
			}
		};

		const handleReceiveMessage = (message: Message) => {
			handleAudioNotification(message);
			setMessages((prevMessages) => [...prevMessages, message]);
		};
		socket.on(SocketRoomEvents.CHAT_MESSAGE, handleReceiveMessage);

		return () => {
			socket.off(SocketRoomEvents.CHAT_MESSAGE, handleReceiveMessage);
		};
	}, [audioContext, ourPlayer.socketId]);

	const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const message = messageInputRef.current?.value?.trim();

		if (!message) {
			return;
		}

		socket.emit(SocketRoomEvents.CHAT_MESSAGE, roomCode, message);
		messageInputRef.current!.value = '';
	};

	// Scroll to the bottom of the chat when a new message is received and user was at the bottom
	useEffect(() => {
		const list = messageListRef.current;
		if (!list) return;

		const lastMessage = list.lastElementChild as HTMLElement | null;
		if (!lastMessage) return;

		const lastMessageStyle = window.getComputedStyle(lastMessage);
		const marginTop = parseInt(lastMessageStyle.marginTop, 10);
		const marginBottom = parseInt(lastMessageStyle.marginBottom, 10);

		const lastMessageHeight = lastMessage.offsetHeight + marginTop + marginBottom;
		const messagesListHeight = list.scrollHeight;
		const heightBeforeLastMessage = messagesListHeight - lastMessageHeight;
		const scrollPosition = list.scrollTop + list.clientHeight;

		if (scrollPosition >= heightBeforeLastMessage) {
			list.scrollTo({ top: list.scrollHeight, behavior: 'auto' });
		}
	}, [messages]);

	return (
		<aside className={classes.container} aria-label="chat">
			<ChatHeader />

			<ul className={classes.messagesList} ref={messageListRef}>
				{messages.map((message, i) => (
					<MessageComponent
						key={message.messageId}
						message={message}
						prevMsgSameUser={(() => {
							if (i === 0 || message.type === 'joined-left') {
								return false;
							}
							const prevMsg = messages[i - 1];
							return prevMsg.type === 'user'
								&& prevMsg.socketId === message.socketId;
						})()}
					/>
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
					enterKeyHint="send"
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
