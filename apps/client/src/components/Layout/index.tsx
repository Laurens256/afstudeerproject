import { type RoutePath, RoutesConfig } from '@/routes';
import { useRouter } from 'next/router';
import socket from '@/socket';
// import { ToastProvider, ToastViewport } from '@radix-ui/react-toast';
import classes from './Layout.module.css';
import { AudioProvider } from '../AudioProvider';
import { ToastProvider } from '../ToastProvider';

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

	return (
		<AudioProvider>
			<ToastProvider />
			{children}
		</AudioProvider>
	);
};

export default Layout;
