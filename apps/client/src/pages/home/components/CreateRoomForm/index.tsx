import { Button, Input } from '@/components';
import socket from '@/socket';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { RoutePath, generateRoute } from '@/routes';
import classes from './CreateRoomForm.module.css';

const CreateRoomForm = () => {
	const router = useRouter();
	const [maxPlayersError, setMaxPlayersError] = useState<string | null>(null);
	const [isPrivate, setIsPrivate] = useState<boolean>(false);

	const createRoom = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const maxPlayers = parseInt((e.currentTarget).create_max_player.value, 10);
		if (!Number.isFinite(maxPlayers) || maxPlayers < 2 || maxPlayers > 20) {
			setMaxPlayersError('Please enter a number between 2 and 20');
			return;
		}
		setMaxPlayersError(null);
		// emit room create request to server
		socket.emit('ROOM_CREATE', { maxPlayers, isPrivate });
	};

	useEffect(() => {
		// receive room code from server and redirect to room
		const onRoomCreate = (roomCode: string) => {
			router.push(generateRoute(RoutePath.Room, { roomCode }));
		};

		socket.on('ROOM_CREATE', onRoomCreate);

		return () => {
			socket.off('ROOM_CREATE', onRoomCreate);
		};
	}, [router]);

	return (
		<form onSubmit={createRoom} className={classes.form} noValidate>
			<Input
				className={classes.maxPlayersInput}
				id="create_max_player"
				label={(
					<>
						Maximum players
						{' '}
						<small className={classes.maxPlayersHint}>(2-20)</small>
					</>
				)}
				defaultValue={8}
				inputMode="numeric"
				type="number"
				error={maxPlayersError}
			/>

			<div className={classes.privateRoomToggleContainer}>
				<input
					name="private_toggle"
					id="private_toggle"
					type="checkbox"
					checked={isPrivate}
					onChange={(e) => setIsPrivate(e.target.checked)}
				/>
				<label htmlFor="private_toggle">
					Private room
					<div className={classes.toggle} />
				</label>
			</div>

			<Button type="submit" className={classes.submitButton}>Create room</Button>
		</form>
	);
};

export default CreateRoomForm;
