import { Input, Button } from '@/components';
import { useState, useEffect, useRef } from 'react';
import socket from '@/socket';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import { IconRefresh } from '@tabler/icons-react';
import Head from 'next/head';
import { useLocalStorage } from '@/hooks';
import { validateUsername } from '@/utils';
import classes from './NameInput.module.css';

type NameInputProps = {
	setUsername: (username: string) => void;
	roomCode: string;
};

const NameInput = ({ setUsername, roomCode }: NameInputProps) => {
	const [unverifiedUsername, setUnverifiedUsername] = useLocalStorage({ key: 'username', defaultValue: '' });
	const [inputError, setInputError] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleNameSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const username = (formData.get('username') as string);
		const { isValid, error } = validateUsername(username);

		setInputError(error);

		if (isValid) {
			socket.emit('ROOM_JOIN', roomCode, username);
			setIsLoading(true);
		}
	};

	const generateRandomName = () => {
		setUnverifiedUsername(uniqueNamesGenerator({
			dictionaries: [adjectives, animals],
			separator: '-',
			style: 'capital',
		}));
		inputRef.current?.focus(); // focus input so generated name gets read by screenreader
	};

	useEffect(() => {
		const handleRoomJoin = (username: string, error: string | null) => {
			setInputError(error);
			setIsLoading(false);
			if (error === null) {
				// when username is set, parent component will render room instead of this component
				setUsername(username);
			}
		};

		socket.on('ROOM_JOIN', handleRoomJoin);

		return () => {
			socket.off('ROOM_JOIN', handleRoomJoin);
		};
	}, [setUsername]);

	return (
		<>
			<Head>
				<title>Choose a username</title>
			</Head>
			<main className={classes.pageContainer}>
				<form onSubmit={handleNameSubmit} className={classes.form}>
					<Input
						label="Choose a name"
						id="username"
						name="username"
						type="text"
						autoComplete="off"
						error={inputError}
						maxLength={20}
						value={unverifiedUsername}
						onChange={(e) => setUnverifiedUsername(e.target.value)}
						autoFocus
					>
						<Button
							onClick={generateRandomName}
							className={classes.randomNameButton}
							aria-label="generate random name"
						>
							<IconRefresh size={20} />
						</Button>
					</Input>

					<Button type="submit" loading={isLoading}>Join</Button>
				</form>
			</main>
		</>
	);
};

export default NameInput;
