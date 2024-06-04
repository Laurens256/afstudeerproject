import type { Message, Player } from '@shared/types';
import { useRef, useContext, useEffect, useCallback } from 'react';
import { AudioContext } from '@/components';
import classes from './MessagesList.module.css';
import MessageComponent from './Message';
import { useScrollToBottom } from './hooks';

type MessagesListProps = {
	messages: Message[];
	ourPlayer: Player;
};
const MessagesList = ({ messages, ourPlayer }: MessagesListProps) => {
	const listRef = useScrollToBottom(messages);
	const audioContext = useContext(AudioContext);
	const scrollPositionRef = useRef<number>(0);

	const checkShouldPlayAudioNotification = useCallback((message: Message) => {
		if (message.type === 'user' && message.socketId !== ourPlayer.socketId) {
			audioContext.gameChat('messageReceived');
		} else if (message.type === 'joined-left') {
			audioContext.gameChat(`player${message.action === 'joined' ? 'Joined' : 'Left'}`);
		}
	}, [audioContext, ourPlayer.socketId]);

	useEffect(() => {
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
