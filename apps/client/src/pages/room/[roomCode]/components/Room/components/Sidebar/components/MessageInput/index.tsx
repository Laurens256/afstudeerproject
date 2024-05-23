import { Input, Button } from '@/components';
import { useRef } from 'react';
import { IconSend } from '@tabler/icons-react';
import socket from '@/socket';
import classes from './MessageInput.module.css';

const MessageInput = () => {
	const inputRef = useRef<HTMLInputElement>(null);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const input = inputRef.current;
		const message = input?.value?.trim();

		if (!message) {
			return;
		}

		socket.emit('ROOM_CHAT_MESSAGE', message);
		input!.value = '';
	};

	return (
		<form onSubmit={onSubmit} className={classes.messageForm}>
			<Input
				className={classes.messageInput}
				ref={inputRef}
				label="send a message"
				id="send-message"
				name="send-message"
				labelVisuallyHidden
				autoComplete="off"
				autoCapitalize="on"
				placeholder="Start typing..."
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
	);
};

export default MessageInput;
