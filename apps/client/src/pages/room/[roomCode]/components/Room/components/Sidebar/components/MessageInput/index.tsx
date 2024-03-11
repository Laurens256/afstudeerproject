import { Input, Button } from '@/components';
import { useRef } from 'react';
import { IconSend } from '@tabler/icons-react';
import classes from './MessageInput.module.css';

type MessageInputProps = {
	onMessageSend: (message: string) => void;
};
const MessageInput = ({ onMessageSend }: MessageInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const message = inputRef.current?.value?.trim();

		if (!message) {
			return;
		}

		onMessageSend(message);
		inputRef.current!.value = '';
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
	);
};

export default MessageInput;
