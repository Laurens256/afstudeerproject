import Link from 'next/link';
import { IconUsers, IconRefresh } from '@tabler/icons-react';
import { RoutePath, generateRoute } from '@/routes';
import { useEffect, useRef, useState } from 'react';
import type { PublicRoom } from '@shared/types';
import socket from '@/socket';
import { Button } from '@/components';
import classes from './PublicRooms.module.css';

const PublicRooms = () => {
	const [publicRooms, setPublicRooms] = useState<PublicRoom[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const getPublicRooms = () => {
		socket.emit('ROOM_GET_PUBLIC_ROOMS');
		setIsLoading(true);
	};

	const fetchInterval = useRef<ReturnType<typeof setInterval>>();

	useEffect(() => {
		const updatePublicRooms = (rooms: PublicRoom[]) => {
			setPublicRooms(rooms);
			setIsLoading(false);
		};

		socket.on('ROOM_GET_PUBLIC_ROOMS', updatePublicRooms);

		getPublicRooms();
		fetchInterval.current = setInterval(() => {
			getPublicRooms();
		}, 7500);

		return () => {
			socket.off('ROOM_GET_PUBLIC_ROOMS', updatePublicRooms);
			clearInterval(fetchInterval.current);
		};
	}, []);

	return (
		<section className={classes.container}>
			<div className={classes.titleContainer}>
				<h2 id="public_rooms">Public rooms</h2>
				<Button
					variant="icon"
					aria-label="reload public rooms"
					onClick={(e) => {
						e.currentTarget.classList.toggle(classes.spin);
						getPublicRooms();
					}}
					disabled={isLoading}
				>
					<IconRefresh />
				</Button>
			</div>
			<div aria-busy={isLoading}>
				{publicRooms.length ? (
					<ul className={classes.list} aria-labelledby="public_rooms">
						{publicRooms.map(
							({ roomCode, roomName, description, playersCount, maxPlayers }) => (
								<li key={roomCode}>
									<Link
										href={generateRoute(RoutePath.Room, { roomCode })}
										className={classes.entry}
									>
										<div className={classes.roomNameContainer}>
											<p>{roomName}</p>
											<small>
												{description}
											</small>
										</div>

										<div className={classes.usersContainer}>
											<p>
												{`${playersCount}/${maxPlayers}`}
												<span className="visuallyHidden">players</span>
											</p>
											<IconUsers />
										</div>
									</Link>
								</li>
							),
						)}
					</ul>
				) : (
					<div className={classes.noRooms}>
						<p>No public rooms available</p>
						<small>Why not create one?</small>
					</div>
				)}
			</div>
		</section>
	);
};

export default PublicRooms;
