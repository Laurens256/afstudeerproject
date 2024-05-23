import Button from '@/components/Button';
import Input from '@/components/Input';
import { useEffect, useRef, useState } from 'react';
import socket from '@/socket';
import { useRouter } from 'next/router';
import { RoutePath, generateRoute } from '@/routes';
import clsx from 'clsx';
import classes from './JoinRoomForm.module.css';

type JoinRoomFormProps = {
	className?: string;
};

const JoinRoomForm = ({ className }: JoinRoomFormProps) => {
	const router = useRouter();
	const inputRef = useRef<HTMLInputElement>(null);
	const [roomCode, setRoomCode] = useState('');
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (roomCode.length !== 6) {
			setError('Room PIN must be 6 characters');
			inputRef.current?.focus();
			return;
		}

		socket.emit('ROOM_EXISTS', roomCode);
	};

	const handleRoomConnect = (code: string | null) => {
		if (code) {
			setError(null);
			router.push(generateRoute(RoutePath.Room, { roomCode: code }));
		} else {
			setError('Room not found');
			inputRef.current?.focus();
		}
	};

	useEffect(() => {
		socket.on('ROOM_EXISTS', handleRoomConnect);

		return () => {
			socket.off('ROOM_EXISTS', handleRoomConnect);
		};
	});

	return (
		<form onSubmit={handleSubmit} noValidate className={clsx(classes.form, className)}>
			<Input
				className={classes.input}
				label="Enter a room PIN"
				ref={inputRef}
				value={roomCode}
				error={error}
				onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
				id="joinRoomCode"
				required
				autoComplete="off"
				enterKeyHint="go"
				placeholder="Room PIN"
			/>
			<Button className={classes.joinButton} type="submit">
				Enter
			</Button>
		</form>
	);
};

export default JoinRoomForm;
