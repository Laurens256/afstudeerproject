import { useRouter } from 'next/router';
import { RoutePath, RoutesConfig } from '@/routes';
import socket from '@/socket';

const Layout = ({ children }: { children: React.ReactNode }) => {
	const { pathname } = useRouter();

	const matchSlug = (input: string) => input.replace(/\[(\w+)\]/g, ':$1');

	const routeConfig = RoutesConfig[matchSlug(pathname) as RoutePath];
	const isSocketRoute = routeConfig?.hasSocket;

	if (isSocketRoute) {
		socket.connect();
	} else {
		socket.disconnect();
	}

	return <>{children}</>;
};

export default Layout;
