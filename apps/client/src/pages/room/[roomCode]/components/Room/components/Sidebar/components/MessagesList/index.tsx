import type { Message, Player } from '@shared/types';
import { useRef, useContext, useEffect, useCallback } from 'react';
import { AudioContext } from '@/components';
import classes from './MessagesList.module.css';
import MessageComponent from './Message';

type MessagesListProps = {
	messages: Message[];
	ourPlayer: Player;
};
const MessagesList = ({ messages, ourPlayer }: MessagesListProps) => {
	const listRef = useRef<HTMLOListElement>(null);
	const audioContext = useContext(AudioContext);
	const scrollPositionRef = useRef<number>(0);

	// Scroll to the bottom of the chat if user was at bottom before new message
	const checkShouldScrollToBottom = (addedElement: HTMLLIElement) => {
		const list = listRef.current as HTMLOListElement;

		const lastMessageStyle = window.getComputedStyle(addedElement);
		const marginTop = parseInt(lastMessageStyle.marginTop, 10);
		const marginBottom = parseInt(lastMessageStyle.marginBottom, 10);

		const lastMessageHeight = addedElement.offsetHeight + marginTop + marginBottom;
		const messagesListHeight = list.scrollHeight;
		const heightBeforeLastMessage = messagesListHeight - lastMessageHeight;
		const scrollPosition = list.scrollTop + list.clientHeight;

		if (scrollPosition >= heightBeforeLastMessage - 10) {
			list.scrollTo({ top: messagesListHeight, behavior: 'auto' });
		}
	};

	const checkShouldPlayAudioNotification = useCallback((message: Message) => {
		if (message.type === 'user' && message.socketId !== ourPlayer.socketId) {
			audioContext.gameChat('messageReceived');
		} else if (message.type === 'joined-left') {
			audioContext.gameChat(`player${message.action === 'joined' ? 'Joined' : 'Left'}`);
		}
	}, [audioContext, ourPlayer.socketId]);

	useEffect(() => {
		const lastMessageEl = listRef.current?.lastElementChild as HTMLLIElement | null;
		if (lastMessageEl) {
			checkShouldScrollToBottom(lastMessageEl);
		}

		const lastMessage = messages[messages.length - 1];
		if (lastMessage) {
			checkShouldPlayAudioNotification(lastMessage);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messages]);

	return (
		<ol
			className={classes.messagesList}
			ref={listRef}
			aria-labelledby="game-chat-heading"
			onScroll={(e) => {
				scrollPositionRef.current = e.currentTarget.scrollTop;
			}}
		>
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
		</ol>
	);
};

export default MessagesList;
