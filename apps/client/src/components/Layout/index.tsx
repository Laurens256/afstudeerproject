import { type RoutePath, RoutesConfig } from '@/routes';
import { useRouter } from 'next/router';
import socket from '@/socket';
import { useEffect } from 'react';
import classes from './Layout.module.css';
import { AudioProvider } from '../AudioProvider';

const Layout = ({ children }: { children: React.ReactNode }) => {
	const { pathname } = useRouter();

	const sluggedRoute = pathname.replace(/\[(\w+)\]/g, ':$1') as RoutePath;
	const routeConfig = RoutesConfig[sluggedRoute];
	const isSocketRoute = routeConfig?.hasSocket;

	if (isSocketRoute) {
		socket.connect();
	} else {
		socket.disconnect();
	}

	useEffect(() => {
		if (isSocketRoute) {
			const onDisconnect = () => {
				alert('Disconnected from server');
			};
			socket.on('disconnect', onDisconnect)
		}
	}, [isSocketRoute]);

	return (
		<AudioProvider>
			{children}
		</AudioProvider>
	);
};

export default Layout;
