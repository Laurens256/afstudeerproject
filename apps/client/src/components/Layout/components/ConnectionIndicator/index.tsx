import type { RoutePath } from '@/routes';
import { RoutesConfig } from '@/routes';
import socket from '@/socket';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { IconPlug, IconPlugX, IconX } from '@tabler/icons-react';
import Button from '@/components/Button';
import classes from './ConnectionIndicator.module.css';

const ConnectionIndicator = () => {
	const { pathname } = useRouter();
	const [isDisconnected, setIsDisconnected] = useState(false);
	const [showDisconnectToast, setShowDisconnectToast] = useState(false);
	const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

	const sluggedRoute = pathname.replace(/\[(\w+)\]/g, ':$1') as RoutePath;
	const routeConfig = RoutesConfig[sluggedRoute];
	const isSocketRoute = routeConfig?.hasSocket;

	if (isSocketRoute) {
		socket.connect();
	} else {
		socket.disconnect();
	}

	useEffect(() => {
		const onDisconnect = () => {
			setIsDisconnected(true);
		};
		const onConnect = () => {
			setIsDisconnected(false);
		};

		socket.on('disconnect', onDisconnect);
		socket.on('connect', onConnect);

		return () => {
			socket.off('disconnect', onDisconnect);
			socket.off('connect', onConnect);
		};
	}, [isSocketRoute]);

	useEffect(() => {
		clearTimeout(timeoutRef.current);

		if (isDisconnected && isSocketRoute) {
			setShowDisconnectToast(true);
		} else if (!isDisconnected) {
			timeoutRef.current = setTimeout(() => {
				if (isDisconnected) return;
				setShowDisconnectToast(false);
			}, 5000);
		}
	}, [isDisconnected, isSocketRoute]);

	if (!isSocketRoute || !showDisconnectToast) return null;

	return (
		<div
			className={clsx(
				classes.root,
				isDisconnected && classes.disconnected,
			)}
			aria-live="assertive"
			role="alert"
		>
			{isDisconnected ? (
				<IconPlugX className={classes.icon} />
			) : (
				<IconPlug className={classes.icon} />
			)}
			<div>
				<h2 className={classes.title}>
					{`You got ${isDisconnected ? 'dis' : 're'}connected`}
				</h2>
				<p className={classes.subtitle}>
					{isDisconnected ? 'Trying to reconnect...' : 'You are back online!'}
				</p>
			</div>

			<Button
				variant="unstyled"
				onClick={() => setShowDisconnectToast(false)}
				aria-label="dismiss connection indicator"
				className={classes.dismissButton}
			>
				<IconX />
			</Button>
		</div>
	);
};

export default ConnectionIndicator;
