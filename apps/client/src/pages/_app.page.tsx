import '@/styles/reset.css';
import '@/styles/variables.css';
import '@/styles/global.css';
import Head from 'next/head';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/query-client';
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
		<QueryClientProvider client={queryClient}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</QueryClientProvider>
	</>
);

export default Home;
