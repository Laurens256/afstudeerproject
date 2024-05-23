import { AudioProvider } from '../AudioProvider';
import { ConnectionIndicator } from './components';

const Layout = ({ children }: { children: React.ReactNode }) => (
	<AudioProvider>
		{children}
		<ConnectionIndicator />
	</AudioProvider>
);

export default Layout;
