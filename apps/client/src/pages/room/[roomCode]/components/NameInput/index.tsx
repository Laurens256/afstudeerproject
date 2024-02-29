import { Input } from '@/components';
import { useState, useEffect } from 'react';
import socket from '@/socket';
import { SocketRoomEvents } from '@shared/types';
import classes from './NameInput.module.css';

type NameInputProps = {
	setUsername: (username: string) => void;
	roomCode: string;
};

const NameInput = ({ setUsername, roomCode }: NameInputProps) => {
	const [unverifiedUsername, setUnverifiedUsername] = useState<string>('');
	const [inputError, setInputError] = useState<string | null>(null);

	const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const username = (formData.get('username') as string).trim();

		switch (true) {
			case username.length < 2:
				setInputError('Username must be at least 2 characters');
				break;
			case username.length > 20:
				setInputError('Username can\'t be longer than 20 characters');
				break;
			default:
				setInputError(null);
				setUnverifiedUsername(username);
		}
	};

	useEffect(() => {
		if (!unverifiedUsername) {
			return;
		}

		const handleRoomJoin = (error: string | null) => {
			setInputError(error);
			if (error === null) {
				setUsername(unverifiedUsername);
			}
		};

		socket.emit(SocketRoomEvents.JOIN, roomCode, unverifiedUsername);
		socket.on(SocketRoomEvents.JOIN, handleRoomJoin);

		return () => {
			socket.off(SocketRoomEvents.JOIN, handleRoomJoin);
		};
	}, [setUsername, unverifiedUsername, roomCode]);

	return (
		<main>
			<form onSubmit={handleNameSubmit}>
				<Input
					label="Choose a name"
					id="username"
					name="username"
					error={inputError}
					maxLength={20}
				/>
			</form>
		</main>
	);
};

export default NameInput;
