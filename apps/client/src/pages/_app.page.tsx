import '@/styles/reset.css';
import '@/styles/variables.css';
import '@/styles/global.css';
import Head from 'next/head';
import { Layout } from '@/components';

const Home = ({
	Component,
	pageProps,
}: {
	Component: any;
	pageProps: any;
}) => (
	<>
		<Head>
			<title>Play games</title>
			<link rel="icon" href="/favicon.ico" />
		</Head>
		<Layout>
			<Component {...pageProps} />
		</Layout>
	</>
);

export default Home;
