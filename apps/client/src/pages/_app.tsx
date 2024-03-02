import '@/styles/reset.css';
import '@/styles/variables.css';
import '@/styles/global.css';
import Head from 'next/head';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/query-client';
import { Layout } from '@/components';

export default function Home({
	Component,
	pageProps
}: {
	Component: any;
	pageProps: any;
}) {
	return (
		<>
			<Head>
				<title>Create Next App</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<QueryClientProvider client={queryClient}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</QueryClientProvider>
		</>
	);
}
